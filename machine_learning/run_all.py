"""Run the complete ML pipeline: preprocessing -> training -> final evaluation."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent

steps = [
    ROOT / "src" / "data_processing.py",
    ROOT / "src" / "train_model.py",
    ROOT / "src" / "evaluate_model.py",
]

for step in steps:
    print(f"\n=== Running {step.name} ===")
    subprocess.run([sys.executable, str(step)], cwd=ROOT, check=True)

print("\nAll machine-learning stages completed successfully.")
