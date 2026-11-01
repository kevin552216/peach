"""独立测试包的资源标记与用户数据目录。"""
from __future__ import annotations

import sys
from pathlib import Path


def standalone() -> bool:
    return bool(getattr(sys, "frozen", False) and
                (Path(getattr(sys, "_MEIPASS", "")) / "standalone.txt").is_file())


def in_app_update() -> bool:
    """应用内下载并替换安装只有 Windows 独立包有；macOS 独立包下载 DMG 手动替换。"""
    return sys.platform == "win32" and standalone()


def user_data_root(environ: dict[str, str]) -> Path:
    if sys.platform == "win32":
        base = Path(environ.get("LOCALAPPDATA") or Path.home() / "AppData" / "Local")
    else:
        base = Path.home() / "Library" / "Application Support"
    return base / "Peach" / "peach-data"
