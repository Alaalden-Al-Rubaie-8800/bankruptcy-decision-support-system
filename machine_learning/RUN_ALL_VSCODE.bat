@echo off
setlocal

echo Installing requirements...
python -m pip install -r requirements.txt || goto :error

echo.
echo Running data processing...
python src\data_processing.py || goto :error

echo.
echo Running model training...
python src\train_model.py || goto :error

echo.
echo Running evaluation...
python src\evaluate_model.py || goto :error

echo.
echo Running smoke test...
python src\smoke_test.py || goto :error

echo.
echo All machine-learning stages completed successfully.
pause
exit /b 0

:error
echo.
echo A machine-learning stage failed. Check the error above.
pause
exit /b 1
