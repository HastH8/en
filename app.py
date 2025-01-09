from flask import Flask, render_template, jsonify, request
from datetime import datetime
from collections import defaultdict
import os


app = Flask(__name__)

# Store game scores and quiz data
scores = []
quiz_questions = [
    {
        "question": "What percentage of Indigenous communities in Canada face water issues?",
        "options": ["60%", "45%", "15%", "30%"],
        "correct": "15%"
    },
    {
        "question": "How long has the Shamattawa First Nation been under a boil water advisory?",
        "options": ["Since 2020", "Since 2018", "Since 2015", "Since 2016"],
        "correct": "Since 2018"
    },
    {
        "question": "How much did the federal government allocate for water improvements in 2016?",
        "options": ["$2.5 billion", "$1 billion", "$2 billion", "$1.5 billion"],
        "correct": "$2 billion"
    },
    {
        "question": "How many First Nations communities are affected by the water crisis?",
        "options": ["718+", "518+", "418+", "618+"],
        "correct": "618+"
    },
    {
        "question": "What amount was spent on infrastructure by 2020?",
        "options": ["$1.89 billion", "$1.79 billion", "$1.59 billion", "$1.69 billion"],
        "correct": "$1.79 billion"
    },
    {
        "question": "How many times higher is the risk of waterborne diseases in affected communities?",
        "options": ["31x", "16x", "26x", "21x"],
        "correct": "26x"
    },
    {
        "question": "How many unsafe water advisories were recorded in 2018?",
        "options": ["184", "154", "174", "164"],
        "correct": "174"
    },
    {
        "question": "What is the longest recorded period for a community under boil water advisory?",
        "options": ["30+ years", "15+ years", "25+ years", "20+ years"],
        "correct": "30+ years"
    },
    {
        "question": "Which First Nation launched a class action lawsuit against the federal government?",
        "options": ["Grassy Narrows", "Shamattawa", "Neskantaga", "Attawapiskat"],
        "correct": "Shamattawa"
    },
    {
        "question": "When was the most recent legislation proposed for addressing the water crisis?",
        "options": ["2024", "2021", "2023", "2022"],
        "correct": "2023"
    }
]


# Add at the top with other imports

# Add after scores declaration
group_statistics = defaultdict(lambda: {
    'total_attempts': 0,
    'correct_answers': 0,
    'questions_stats': defaultdict(lambda: {'correct': 0, 'incorrect': 0})
})


# Add new route for statistics
@app.route('/statistics')
def statistics():
    return render_template('statistics.html', statistics=dict(group_statistics))

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
# Modify the check_answer route
@app.route('/check_answer', methods=['POST'])
def check_answer():
    data = request.json
    question_index = int(data['questionIndex'])
    selected_answer = data['answer'].strip()
    group_name = data.get('groupName', 'default')

    if question_index < 0 or question_index >= len(quiz_questions):
        return jsonify({'error': 'Invalid question index'}), 400

    correct_answer = quiz_questions[question_index]['correct'].strip()
    is_correct = selected_answer == correct_answer

    # Update group statistics
    group_statistics[group_name]['total_attempts'] += 1
    if is_correct:
        group_statistics[group_name]['correct_answers'] += 1
        group_statistics[group_name]['questions_stats'][question_index]['correct'] += 1
    else:
        group_statistics[group_name]['questions_stats'][question_index]['incorrect'] += 1

    return jsonify({'correct': is_correct})
# Add this route to your Flask app
@app.route('/qr')
def generate_qr():
    host = request.host_url
    quiz_url = f"{host}quiz"
    return render_template('qr.html', quiz_url=quiz_url)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8088))
    app.run(host='0.0.0.0', port=port, debug=True)
