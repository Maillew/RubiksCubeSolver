#CREDIT TO KOCIEMBA
# https://github.com/hkociemba/RubiksCube-TwophaseSolver
from flask import Flask
import twophase.solver  as sv

app = Flask(__name__)

@app.route("/<scramble>")
def solve(scramble):
    return sv.solve(scramble, 20, 2)
app.run(host='0.0.0.0', port=3000)
