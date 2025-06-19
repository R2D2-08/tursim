from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import traceback
import tempfile
import subprocess
import sys
import os

app = FastAPI()

class CodePayload(BaseModel):
    code: str

class ExecuteCodeResponse(BaseModel):
    output: str
    error: Optional[str] = None

SAFE_GLOBALS = {
    "__builtins__": {
        "range": range,
        "len": len,
        "print": print,
        "str": str,
        "int": int,
        "float": float,
        "bool": bool,
    }
}

@app.post("/execute", response_model=ExecuteCodeResponse)
async def execute_code(payload: CodePayload):
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as tmpfile:
        tmpfile.write(payload.code)
        tmpfile_path = tmpfile.name

    try:
        python_executable = sys.executable
        result = subprocess.run(
            [python_executable, tmpfile_path],
            capture_output=True,
            text=True,
            timeout=10,
            env=os.environ.copy(),
        )
        output = result.stdout
        error = result.stderr if result.returncode != 0 else None
        return ExecuteCodeResponse(output=output, error=error)
    except subprocess.TimeoutExpired:
        return ExecuteCodeResponse(output="", error="Execution timed out.")
    except Exception:
        return ExecuteCodeResponse(output="", error=traceback.format_exc())
    finally:
        try:
            os.remove(tmpfile_path)
        except Exception:
            pass

