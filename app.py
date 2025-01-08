from flask import Flask, render_template, jsonify, request
from datetime import datetime

app = Flask(__name__)

# Store game scores and quiz data
scores = []
quiz_questions = [
    {
        "question": "What percentage of Indigenous communities in Canada face water issues?",
        "options": ["15%", "30%", "45%", "60%"],
        "correct": "45%"
    },
    {
        "question": "How long has the Shamattawa First Nation been under a boil water advisory?",
        "options": ["Since 2015", "Since 2016", "Since 2018", "Since 2020"],
        "correct": "Since 2018"
    },
    {
        "question": "How much did the federal government allocate for water improvements in 2016?",
        "options": ["$1 billion", "$1.5 billion", "$2 billion", "$2.5 billion"],
        "correct": "$2 billion"
    },
    {
        "question": "How many First Nations communities are affected by the water crisis?",
        "options": ["418+", "518+", "618+", "718+"],
        "correct": "618+"
    },
    {
        "question": "What amount was spent on infrastructure by 2020?",
        "options": ["$1.59 billion", "$1.69 billion", "$1.79 billion", "$1.89 billion"],
        "correct": "$1.79 billion"
    },
    {
        "question": "How many times higher is the risk of waterborne diseases in affected communities?",
        "options": ["16x", "21x", "26x", "31x"],
        "correct": "26x"
    },
    {
        "question": "How many unsafe water advisories were recorded in 2018?",
        "options": ["154", "164", "174", "184"],
        "correct": "174"
    },
    {
        "question": "What is the longest recorded period for a community under boil water advisory?",
        "options": ["15+ years", "20+ years", "25+ years", "30+ years"],
        "correct": "25+ years"
    },
    {
        "question": "Which First Nation launched a class action lawsuit against the federal government?",
        "options": ["Neskantaga", "Shamattawa", "Attawapiskat", "Grassy Narrows"],
        "correct": "Shamattawa"
    },
    {
        "question": "When was the most recent legislation proposed for addressing the water crisis?",
        "options": ["2021", "2022", "2023", "2024"],
        "correct": "2023"
    }
]



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html', questions=quiz_questions)

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.json
    scores.append({
        'name': data['name'],
        'score': data['score'],
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })
    return jsonify({'status': 'success'})

@app.route('/get_scores')
def get_scores():
    return jsonify(sorted(scores, key=lambda x: x['score'], reverse=True)[:10])
@app.route('/check_answer', methods=['POST'])
def check_answer():
    data = request.json
    question_index = int(data['questionIndex'])  # Ensure the index is an integer
    selected_answer = data['answer'].strip()    # Strip leading/trailing whitespace

    # Validate index range
    if question_index < 0 or question_index >= len(quiz_questions):
        return jsonify({'error': 'Invalid question index'}), 400

    correct_answer = quiz_questions[question_index]['correct'].strip()
    is_correct = selected_answer == correct_answer

    print(f"Question Index: {question_index}, Selected Answer: {selected_answer}, Correct Answer: {correct_answer}, Is Correct: {is_correct}")

    return jsonify({'correct': is_correct})

import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8088))
    app.run(host='0.0.0.0', port=port, debug=True)

