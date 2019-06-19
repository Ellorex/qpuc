var newQuestion = document.getElementById('newQuestion');
        var newAnswer1 = document.getElementById('newAnswer1');
        var newAnswer2 = document.getElementById('newAnswer2');
        var newAnswer3 = document.getElementById('newAnswer3');
        var newAnswer4 = document.getElementById('newAnswer4');
        var newAnswer1Correct = document.getElementById('newAnswer1Correct');
        var newAnswer2Correct = document.getElementById('newAnswer2Correct');
        var newAnswer3Correct = document.getElementById('newAnswer3Correct');
        var newAnswer4Correct = document.getElementById('newAnswer4Correct');

        var question = {
            title: newQuestion,
            answers: [{
                title: newAnswer1,
                correct: newAnswer1Correct
            }, 
            {
                title: newAnswer2,
                correct: newAnswer2Correct
            }, 
            {
                title: newAnswer3,
                correct: newAnswer3Correct
            }, 
            {
                title: newAnswer4,
                correct: newAnswer4Correct
            }]
        }