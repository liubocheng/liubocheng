#!/usr/bin/env python3

import argparse
import json
import logging
import os
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union


@dataclass
class Bookmark:
    """Represents a single bookmark."""
    title: str
    url: str
    type: str = "bookmark"


@dataclass
class BookmarkFolder:
    """Represents a bookmark folder containing other bookmarks or folders."""
    title: str
    type: str = "folder"
    children: List[Union[Bookmark, 'BookmarkFolder']] = field(default_factory=list)


@dataclass
class Space:
    """Represents an Arc browser space."""
    name: str
    container_id: str
    is_pinned: bool


class ArcDataError(Exception):
    """Custom exception for Arc data parsing errors."""
    pass


class Colors:
    """ANSI color codes for terminal output."""
    RESET = "\033[0m"
    BOLD = "\033[1m"
    GREY = "\033[90m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    CYAN = "\033[36m"
    MAGENTA = "\033[35m"

    @staticmethod
    def background(color: str) -> str:
        """Convert foreground color to background color."""
        return color.replace("[3", "[4", 1)


class CustomFormatter(logging.Formatter):
    """Custom formatter for colored logging output."""
    
    def __init__(self):
        super().__init__()
        time_format = f"{Colors.GREY}%(asctime)s{Colors.RESET}"
        self.FORMATS = {
            logging.DEBUG: f"{time_format} {Colors.BOLD}{Colors.CYAN}DEBG{Colors.RESET} %(message)s",
            logging.INFO: f"{time_format} {Colors.BOLD}{Colors.GREEN}INFO{Colors.RESET} %(message)s",
            logging.WARNING: f"{time_format} {Colors.BOLD}{Colors.YELLOW}WARN{Colors.RESET} %(message)s",
            logging.ERROR: f"{time_format} {Colors.BOLD}{Colors.RED}ERRR{Colors.RESET} %(message)s",
            logging.CRITICAL: f"{time_format} {Colors.BOLD}{Colors.background(Colors.RED)}CRIT{Colors.RESET} %(message)s",
        }

    def format(self, record: logging.LogRecord) -> str:
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt, datefmt="%H:%M")
        return formatter.format(record)


class ArcDataReader:
    """Handles reading and parsing Arc browser data."""
    
    FILENAME = "StorableSidebar.json"
    
    @classmethod
    def get_arc_data_path(cls) -> Path:
        """Get the path to Arc's data file based on the operating system."""
        if os.name == "nt":
            # Windows
            arc_root_parent = Path(os.path.expanduser(r"~\AppData\Local\Packages"))
            arc_root_paths = [
                f for f in arc_root_parent.glob("*")
                if f.name.startswith("TheBrowserCompany.Arc")
            ]
            if len(arc_root_paths) != 1:
                raise ArcDataError("Arc installation not found or multiple installations detected")
            
            return arc_root_paths[0] / r"LocalCache\Local\Arc" / cls.FILENAME
        else:
            # macOS/Linux
            return Path(os.path.expanduser("~/Library/Application Support/Arc/")) / cls.FILENAME
    
    @classmethod
    def read_data(cls) -> Dict:
        """Read Arc browser data from JSON file."""
        logging.info("Reading Arc browser data...")
        
        # Check current directory first
        current_file = Path(cls.FILENAME)
        if current_file.exists():
            logging.debug(f"Found {cls.FILENAME} in current directory")
            with current_file.open("r", encoding="utf-8") as f:
                return json.load(f)
        
        # Check Arc's data directory
        library_path = cls.get_arc_data_path()
        if library_path.exists():
            logging.debug(f"Found {cls.FILENAME} in Arc's data directory")
            with library_path.open("r", encoding="utf-8") as f:
                return json.load(f)
        
        raise ArcDataError(
            f'File not found. Look for "{cls.FILENAME}" '
            f'in the Arc browser data directory: {library_path.parent}'
        )


class ArcDataParser:
    """Parses Arc browser data structure into bookmarks."""
    
    def __init__(self, data: Dict, include_unpinned: bool = False):
        self.data = data
        self.include_unpinned = include_unpinned
        self.item_lookup = {}
    
    def parse(self) -> List[BookmarkFolder]:
        """Parse Arc data and return bookmark folders from all containers."""
        logging.info("Parsing Arc browser data...")
        
        containers = self.data["sidebar"]["containers"]
        all_folders = []
        
        for container_index, container in enumerate(containers):
            if not isinstance(container, dict):
                continue
                
            # Skip containers without bookmark data
            if "spaces" not in container or "items" not in container:
                logging.debug(f"Skipping container {container_index} - no spaces or items")
                continue
            
            logging.info(f"Processing container {container_index}...")
            
            spaces = self._parse_spaces(container["spaces"])
            items = container["items"]
            
            # Create lookup dictionary for items in this container
            self.item_lookup = {item["id"]: item for item in items if isinstance(item, dict)}
            
            # Convert spaces to folders for this container
            container_folders = self._convert_spaces_to_folders(spaces)
            
            # Add container identifier if we have multiple containers with data
            if len([c for c in containers if isinstance(c, dict) and "spaces" in c and "items" in c]) > 1:
                if container_folders:
                    # Wrap all folders from this container in a parent folder
                    container_name = f"Profile {container_index + 1}"
                    # Check if container has any identifying info
                    if "global" in container:
                        container_name = "Main Profile"
                    elif hasattr(container, 'profile') or any('profile' in str(space) for space in container.get("spaces", [])):
                        container_name = f"Profile {container_index + 1}"
                    
                    parent_folder = BookmarkFolder(title=container_name, children=container_folders)
                    all_folders.append(parent_folder)
            else:
                # Single container, add folders directly
                all_folders.extend(container_folders)
        
        if not all_folders:
            logging.warning("No bookmark data found in any container")
        
        return all_folders
    
    def _find_data_container(self, containers: List) -> int:
        """Find the container that contains bookmark data (spaces and items)."""
        # First try to find a container with 'global' key that also has data
        for i, container in enumerate(containers):
            if isinstance(container, dict) and "global" in container:
                if "spaces" in container and "items" in container:
                    return i
        
        # If no global container has data, find the container with spaces and items
        for i, container in enumerate(containers):
            if isinstance(container, dict) and "spaces" in container and "items" in container:
                logging.debug(f"Using container {i} which has spaces and items")
                return i
        
        raise ArcDataError("No container with bookmark data (spaces and items) found")
    
    def _parse_spaces(self, spaces_data: List) -> List[Space]:
        """Parse spaces from Arc data."""
        logging.info("Parsing spaces...")
        
        spaces = []
        unnamed_counter = 1
        
        for space_data in spaces_data:
            # Skip string entries (they might be space IDs or references)
            if not isinstance(space_data, dict):
                logging.debug(f"Skipping non-dict space entry: {space_data}")
                continue
            
            # Skip spaces without the required structure
            if "newContainerIDs" not in space_data:
                logging.debug(f"Skipping space without newContainerIDs: {space_data.get('id', 'unknown')}")
                continue
                
            # Get space title
            title = space_data.get("title", f"Space {unnamed_counter}")
            if "title" not in space_data:
                unnamed_counter += 1
            
            # Parse container IDs to find pinned/unpinned status
            containers = space_data.get("newContainerIDs", [])
            
            # Process all containers in this space (both pinned and unpinned)
            for i, container in enumerate(containers):
                if isinstance(container, dict) and i + 1 < len(containers):
                    container_id = str(containers[i + 1])
                    is_pinned = "pinned" in container
                    
                    spaces.append(Space(
                        name=title,
                        container_id=container_id,
                        is_pinned=is_pinned
                    ))
        
        logging.debug(f"Found {len(spaces)} valid spaces")
        return spaces
    
    def _convert_spaces_to_folders(self, spaces: List[Space]) -> List[BookmarkFolder]:
        """Convert Arc spaces to bookmark folders."""
        if not spaces:
            return []
            
        logging.info("Converting spaces to bookmark folders...")
        
        folders = []
        total_bookmarks = 0
        
        # Process ALL spaces or only pinned ones based on settings
        for space in spaces:
            if not self.include_unpinned and not space.is_pinned:
                continue
                
            children = self._build_folder_tree(space.container_id)
            
            # Only create folder if it has content
            if children:
                folder_title = space.name
                if not space.is_pinned:
                    folder_title += " (Unpinned)"
                
                folder = BookmarkFolder(title=folder_title, children=children)
                folders.append(folder)
                
                # Count bookmarks for logging
                bookmark_count = self._count_bookmarks(children)
                total_bookmarks += bookmark_count
                logging.debug(f"Space '{space.name}': {bookmark_count} bookmarks")
        
        logging.debug(f"Total bookmarks in this container: {total_bookmarks}")
        return folders
    
    def _build_folder_tree(self, parent_id: str) -> List[Union[Bookmark, BookmarkFolder]]:
        """Recursively build folder tree from Arc data."""
        children = []
        
        for item_id, item in self.item_lookup.items():
            if item.get("parentID") != parent_id:
                continue
            
            # Check if it's a bookmark
            if "data" in item and "tab" in item["data"]:
                tab_data = item["data"]["tab"]
                title = item.get("title") or tab_data.get("savedTitle") or "Untitled"
                url = tab_data.get("savedURL") or ""
                
                children.append(Bookmark(title=title, url=url))
            
            # Check if it's a folder
            elif "title" in item:
                folder_children = self._build_folder_tree(item_id)
                folder = BookmarkFolder(title=item["title"], children=folder_children)
                children.append(folder)
        
        return children
    
    def _count_bookmarks(self, items: List[Union[Bookmark, BookmarkFolder]]) -> int:
        """Recursively count bookmarks in a list of items."""
        count = 0
        for item in items:
            if isinstance(item, Bookmark):
                count += 1
            elif isinstance(item, BookmarkFolder):
                count += self._count_bookmarks(item.children)
        return count


class HTMLExporter:
    """Exports bookmarks to HTML format."""
    
    def __init__(self, folders: List[BookmarkFolder]):
        self.folders = folders
    
    def export(self) -> str:
        """Export bookmarks to HTML string."""
        logging.info("Converting bookmarks to HTML...")
        
        html_parts = [
            '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
            '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
            '<TITLE>Bookmarks</TITLE>',
            '<H1>Bookmarks</H1>',
            '<DL><p>'
        ]
        
        for folder in self.folders:
            html_parts.extend(self._folder_to_html(folder, level=1))
        
        html_parts.append('</DL><p>')
        
        logging.debug("HTML conversion completed")
        return '\n'.join(html_parts)
    
    def _folder_to_html(self, folder: BookmarkFolder, level: int) -> List[str]:
        """Convert a bookmark folder to HTML lines."""
        indent = '\t' * level
        lines = [
            f'{indent}<DT><H3>{self._escape_html(folder.title)}</H3>',
            f'{indent}<DL><p>'
        ]
        
        for item in folder.children:
            if isinstance(item, Bookmark):
                lines.append(f'{indent}\t<DT><A HREF="{item.url}">{self._escape_html(item.title)}</A>')
            elif isinstance(item, BookmarkFolder):
                lines.extend(self._folder_to_html(item, level + 1))
        
        lines.append(f'{indent}</DL><p>')
        return lines
    
    def _escape_html(self, text: str) -> str:
        """Escape HTML special characters."""
        if text is None:
            text = ""
        return (text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace('"', "&quot;"))


class VersionInfo:
    """Handles version information from Git."""
    
    @staticmethod
    def get_version() -> Tuple[Optional[str], Optional[datetime]]:
        """Get Git commit hash and timestamp."""
        try:
            commit_hash = subprocess.check_output(
                ["git", "rev-parse", "--short", "HEAD"]
            ).decode("utf-8").strip()
            
            commit_time_str = subprocess.check_output(
                ["git", "log", "-1", "--format=%ct"]
            ).decode("utf-8").strip()
            
            commit_time = datetime.fromtimestamp(int(commit_time_str))
            return commit_hash, commit_time
        except (subprocess.CalledProcessError, FileNotFoundError):
            return None, None
    
    @staticmethod
    def print_version():
        """Print version information."""
        commit_hash, commit_time = VersionInfo.get_version()
        if commit_hash is None or commit_time is None:
            logging.critical("Could not fetch Git metadata.")
            sys.exit(1)
        
        print(
            f"{Colors.BOLD}GIT TIME{Colors.RESET} | "
            f"{Colors.GREEN}{commit_time.strftime('%Y-%m-%d')}{Colors.RESET} "
            f"[{Colors.YELLOW}{int(commit_time.timestamp())}{Colors.RESET}]"
        )
        print(
            f"{Colors.BOLD}GIT HASH{Colors.RESET} | "
            f"{Colors.MAGENTA}{commit_hash}{Colors.RESET}"
        )


class FileWriter:
    """Handles writing output files."""
    
    @staticmethod
    def write_html(content: str, output_path: Optional[Path] = None):
        """Write HTML content to file."""
        logging.info("Writing HTML file...")
        
        if output_path is None:
            current_date = datetime.now().strftime("%Y_%m_%d")
            output_path = Path(f"arc_bookmarks_{current_date}.html")
        
        with output_path.open("w", encoding="utf-8") as f:
            f.write(content)
        
        logging.debug(f"HTML written to {output_path}")


def setup_logging(verbose: bool = False, silent: bool = False):
    """Configure logging with custom formatting."""
    if silent:
        logging.disable(logging.CRITICAL)
        return
    
    handler = logging.StreamHandler()
    handler.setFormatter(CustomFormatter())
    
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(level=level, handlers=[handler])


def create_argument_parser() -> argparse.ArgumentParser:
    """Create and configure argument parser."""
    parser = argparse.ArgumentParser(
        description="Export Arc Browser bookmarks to HTML format.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s                          # Export with default filename
  %(prog)s -o my_bookmarks.html     # Export to specific file
  %(prog)s -v                       # Enable verbose output
  %(prog)s --version                # Show version information
        """
    )
    
    parser.add_argument(
        "-s", "--silent",
        action="store_true",
        help="silence all output"
    )
    
    parser.add_argument(
        "-o", "--output",
        type=Path,
        help="specify the output file path"
    )
    
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="enable verbose output"
    )
    
    parser.add_argument(
        "--include-unpinned",
        action="store_true",
        help="include unpinned spaces in export (default: only pinned)"
    )
    
    parser.add_argument(
        "--all",
        action="store_true", 
        help="export from all containers and include unpinned spaces"
    )
    
    parser.add_argument(
        "--version",
        action="store_true",
        help="print Git version information and exit"
    )
    
    return parser


def main():
    """Main entry point."""
    parser = create_argument_parser()
    args = parser.parse_args()
    
    setup_logging(verbose=args.verbose, silent=args.silent)
    
    if args.version:
        VersionInfo.print_version()
        return
    
    try:
        # Read and parse Arc data
        data = ArcDataReader.read_data()
        
        # Determine export options
        include_unpinned = args.include_unpinned or args.all
        
        parser = ArcDataParser(data, include_unpinned=include_unpinned)
        folders = parser.parse()
        
        # Export to HTML
        exporter = HTMLExporter(folders)
        html_content = exporter.export()
        
        # Write output
        FileWriter.write_html(html_content, args.output)
        
        logging.info("Export completed successfully!")
        
    except ArcDataError as e:
        logging.critical(f"Arc data error: {e}")
        sys.exit(1)
    except FileNotFoundError as e:
        logging.critical(f"File not found: {e}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        logging.critical(f"Invalid JSON data: {e}")
        sys.exit(1)
    except Exception as e:
        logging.critical(f"Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()