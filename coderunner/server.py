from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import traceback

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
    }#,
    #"tools": tools
}

@app.post("/execute", response_model=ExecuteCodeResponse)
async def execute_code(payload: CodePayload):
    local_vars = {}

    try:
        import io, sys
        old_stdout = sys.stdout
        sys.stdout = mystdout = io.StringIO()

        exec(payload.code, SAFE_GLOBALS, local_vars)

        sys.stdout = old_stdout
        output = mystdout.getvalue()

        return ExecuteCodeResponse(output=output)
    except Exception:
        sys.stdout = old_stdout
        return ExecuteCodeResponse(output="", error=traceback.format_exc())

