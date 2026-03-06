import os
from typing import List

def cleanup_files(file_paths: List[str]):
    """
    Deletes the specified files from the disk.
    """
    for file_path in file_paths:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"Cleaned up {file_path}")
        except Exception as e:
            print(f"Failed to delete {file_path}: {e}")
