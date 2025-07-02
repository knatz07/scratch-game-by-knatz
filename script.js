
class ScratchBoardGame {
    constructor() {
        this.currentPlayer = 1;
        this.playerPositions = [0, 0]; // Player 1 and Player 2 positions
        this.playerScores = [0, 0];
        this.gameOver = false;
        this.isRolling = false;
        this.playerNames = ['ผู้เล่น 1', 'ผู้เล่น 2'];
        
        this.initializeScreens();
        this.setupEventListeners();
        this.questions = this.initializeQuestions();
    }
    
    initializeScreens() {
        this.showScreen('startScreen');
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show the requested screen
        document.getElementById(screenId).classList.remove('hidden');
    }
    
    initializeGame() {
        this.currentPlayer = 1;
        this.playerPositions = [0, 0];
        this.playerScores = [0, 0];
        this.gameOver = false;
        this.isRolling = false;
        
        this.updateCurrentPlayerDisplay();
        this.updateScoreDisplay();
        this.updatePlayerNames();
        this.updatePlayerPieces();
        this.updateGameStatus(`เริ่มเกมใหม่! ${this.playerNames[0]} เริ่มเล่นก่อน`);
        document.getElementById('rollButton').disabled = false;
    }
    
    restartGame() {
        this.initializeGame();
    }
    
    goToHome() {
        this.showScreen('startScreen');
    }
    
    showResultPopup(isCorrect, message = '') {
        const popup = document.getElementById('resultPopup');
        const content = document.getElementById('resultPopupContent');
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const messageDiv = document.getElementById('resultMessage');
        
        if (isCorrect) {
            content.className = 'result-popup-content correct';
            title.className = 'result-title correct';
            icon.textContent = '🎉';
            title.textContent = 'ยินดีด้วย!';
            messageDiv.textContent = message || 'คุณตอบถูกต้อง! ได้รับ 1 คะแนน';
        } else {
            content.className = 'result-popup-content incorrect';
            title.className = 'result-title incorrect';
            icon.textContent = '😢';
            title.textContent = 'เสียใจด้วย!';
            messageDiv.textContent = message || 'คำตอบไม่ถูกต้อง ลองใหม่ในครั้งต่อไป';
        }
        
        popup.style.display = 'block';
    }
    
    closeResultPopup() {
        document.getElementById('resultPopup').style.display = 'none';
        this.nextTurn();
    }
    
    updatePlayerNames() {
        document.getElementById('player1NameDisplay').textContent = this.playerNames[0];
        document.getElementById('player2NameDisplay').textContent = this.playerNames[1];
    }
    
    setupEventListeners() {
        // Start screen
        const startGameBtn = document.getElementById('startGameBtn');
        startGameBtn.addEventListener('click', () => this.showScreen('registrationScreen'));
        
        // Registration screen
        const backToStartBtn = document.getElementById('backToStartBtn');
        const startPlayBtn = document.getElementById('startPlayBtn');
        const player1Input = document.getElementById('player1Name');
        const player2Input = document.getElementById('player2Name');
        
        backToStartBtn.addEventListener('click', () => this.showScreen('startScreen'));
        startPlayBtn.addEventListener('click', () => this.startGame());
        
        // Enable/disable play button based on input
        [player1Input, player2Input].forEach(input => {
            input.addEventListener('input', () => this.validatePlayerNames());
        });
        
        // Game screen
        const rollButton = document.getElementById('rollButton');
        if (rollButton) {
            rollButton.addEventListener('click', () => this.rollDice());
        }
        
        // Question modal option buttons
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.selectAnswer(index));
        });
        
        // Game control buttons
        const restartGameBtn = document.getElementById('restartGameBtn');
        const backToHomeBtn = document.getElementById('backToHomeBtn');
        const resultOkBtn = document.getElementById('resultOkBtn');
        
        if (restartGameBtn) {
            restartGameBtn.addEventListener('click', () => this.restartGame());
        }
        
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', () => this.goToHome());
        }
        
        if (resultOkBtn) {
            resultOkBtn.addEventListener('click', () => this.closeResultPopup());
        }
        
        // Winner screen buttons
        const playAgainBtn = document.getElementById('playAgainBtn');
        const homeFromWinnerBtn = document.getElementById('homeFromWinnerBtn');
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.playAgain());
        }
        
        if (homeFromWinnerBtn) {
            homeFromWinnerBtn.addEventListener('click', () => this.goToHome());
        }
    }
    
    validatePlayerNames() {
        const player1Name = document.getElementById('player1Name').value.trim();
        const player2Name = document.getElementById('player2Name').value.trim();
        const startPlayBtn = document.getElementById('startPlayBtn');
        
        if (player1Name && player2Name) {
            startPlayBtn.disabled = false;
            startPlayBtn.style.opacity = '1';
        } else {
            startPlayBtn.disabled = true;
            startPlayBtn.style.opacity = '0.6';
        }
    }
    
    startGame() {
        const player1Name = document.getElementById('player1Name').value.trim();
        const player2Name = document.getElementById('player2Name').value.trim();
        
        if (player1Name && player2Name) {
            this.playerNames[0] = player1Name;
            this.playerNames[1] = player2Name;
            this.showScreen('gameScreen');
            this.initializeGame();
        }
    }
    
    rollDice() {
        if (this.isRolling || this.gameOver) return;
        
        this.isRolling = true;
        const dice = document.getElementById('dice');
        const rollButton = document.getElementById('rollButton');
        const diceResult = document.getElementById('diceResult');
        
        rollButton.disabled = true;
        dice.classList.add('rolling');
        diceResult.textContent = "กำลังทอย...";
        
        // Simulate dice animation
        let rollCount = 0;
        const rollInterval = setInterval(() => {
            const tempValue = Math.floor(Math.random() * 6) + 1;
            dice.innerHTML = `<div class="dice-face">${tempValue}</div>`;
            rollCount++;
            
            if (rollCount >= 10) {
                clearInterval(rollInterval);
                const finalValue = Math.floor(Math.random() * 6) + 1;
                dice.innerHTML = `<div class="dice-face">${finalValue}</div>`;
                dice.classList.remove('rolling');
                diceResult.textContent = `ได้ ${finalValue} แต้ม`;
                
                this.movePlayer(finalValue);
                this.isRolling = false;
            }
        }, 100);
    }
    
    movePlayer(steps) {
        const currentPlayerIndex = this.currentPlayer - 1;
        const newPosition = (this.playerPositions[currentPlayerIndex] + steps) % 28;
        this.playerPositions[currentPlayerIndex] = newPosition;
        
        this.updatePlayerPieces();
        this.updateGameStatus(`${this.playerNames[this.currentPlayer - 1]} ได้ ${steps} แต้ม`);
        
        // Show question after a short delay
        setTimeout(() => {
            this.showQuestion(newPosition);
        }, 500);
    }
    
    updatePlayerPieces() {
        const player1Piece = document.getElementById('player1-piece');
        const player2Piece = document.getElementById('player2-piece');
        
        const player1Position = this.getSquarePosition(this.playerPositions[0]);
        const player2Position = this.getSquarePosition(this.playerPositions[1]);
        
        player1Piece.style.left = player1Position.x + 'px';
        player1Piece.style.top = player1Position.y + 'px';
        
        player2Piece.style.left = player2Position.x + 'px';
        player2Piece.style.top = player2Position.y + 'px';
    }
    
    getSquarePosition(squareIndex) {
        const square = document.querySelector(`[data-position="${squareIndex}"]`);
        if (!square) return { x: 0, y: 0 };
        
        const rect = square.getBoundingClientRect();
        const boardRect = document.querySelector('.game-board').getBoundingClientRect();
        
        return {
            x: rect.left - boardRect.left + rect.width / 2 - 15,
            y: rect.top - boardRect.top + rect.height / 2 - 15
        };
    }
    
    showQuestion(position) {
        const square = document.querySelector(`[data-position="${position}"]`);
        const category = square.getAttribute('data-category');
        
        if (!category) {
            // Special squares (corners)
            this.nextTurn();
            return;
        }
        
        const question = this.getRandomQuestion(category);
        this.displayQuestionModal(question);
    }
    
    getRandomQuestion(category) {
        const categoryQuestions = this.questions[category];
        if (!categoryQuestions || categoryQuestions.length === 0) {
            return this.questions.general[0]; // Fallback to general question
        }
        
        const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
        return categoryQuestions[randomIndex];
    }
    
    displayQuestionModal(question) {
        const modal = document.getElementById('questionModal');
        const title = document.getElementById('questionTitle');
        const text = document.getElementById('questionText');
        const options = document.querySelectorAll('.option-btn');
        
        title.textContent = question.category;
        text.textContent = question.question;
        
        options.forEach((btn, index) => {
            btn.textContent = question.options[index];
            btn.className = 'option-btn';
            btn.disabled = false;
        });
        
        this.currentQuestion = question;
        modal.style.display = 'block';
    }
    
    selectAnswer(answerIndex) {
        const options = document.querySelectorAll('.option-btn');
        const correctAnswer = this.currentQuestion.correctAnswer;
        
        // Disable all buttons
        options.forEach(btn => btn.disabled = true);
        
        // Show correct/incorrect styling
        options[correctAnswer].classList.add('correct');
        if (answerIndex !== correctAnswer) {
            options[answerIndex].classList.add('incorrect');
        }
        
        // Close question modal first
        setTimeout(() => {
            document.getElementById('questionModal').style.display = 'none';
            
            // Update score if correct
            if (answerIndex === correctAnswer) {
                this.playerScores[this.currentPlayer - 1]++;
                this.updateScoreDisplay();
                this.updateGameStatus(`ถูกต้อง! ${this.playerNames[this.currentPlayer - 1]} ได้ 1 คะแนน`);
                
                // Check for winner
                if (this.playerScores[this.currentPlayer - 1] >= 10) {
                    this.gameOver = true;
                    document.getElementById('rollButton').disabled = true;
                    
                    // Show winner screen instead of popup
                    setTimeout(() => {
                        document.getElementById('questionModal').style.display = 'none';
                        this.showWinnerScreen();
                    }, 1500);
                    return;
                } else {
                    this.showResultPopup(true, `ยอดเยี่ยม! ${this.playerNames[this.currentPlayer - 1]} ได้ 1 คะแนน`);
                }
            } else {
                this.showResultPopup(false, `คำตอบที่ถูกคือ: ${this.currentQuestion.options[correctAnswer]}`);
            }
        }, 1500);
    }
    
    nextTurn() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updateCurrentPlayerDisplay();
        document.getElementById('rollButton').disabled = false;
        this.updateGameStatus(`ตาของ${this.playerNames[this.currentPlayer - 1]}`);
    }
    
    updateCurrentPlayerDisplay() {
        const currentPlayerDisplay = document.getElementById('currentPlayer');
        if (currentPlayerDisplay) {
            currentPlayerDisplay.textContent = this.playerNames[this.currentPlayer - 1];
        }
        
        // Update active player styling
        document.querySelectorAll('.player').forEach(player => player.classList.remove('active'));
        const activePlayer = document.querySelector(`.player${this.currentPlayer}`);
        if (activePlayer) {
            activePlayer.classList.add('active');
        }
    }
    
    updateScoreDisplay() {
        document.getElementById('score1').textContent = this.playerScores[0];
        document.getElementById('score2').textContent = this.playerScores[1];
    }
    
    updateGameStatus(message) {
        document.getElementById('gameStatus').textContent = message;
    }
    
    showWinnerScreen() {
        const winnerName = document.getElementById('winnerName');
        const finalScore = document.getElementById('finalScore');
        const correctAnswers = document.getElementById('correctAnswers');
        
        winnerName.textContent = `${this.playerNames[this.currentPlayer - 1]} ชนะแล้ว!`;
        finalScore.textContent = this.playerScores[this.currentPlayer - 1];
        correctAnswers.textContent = this.playerScores[this.currentPlayer - 1];
        
        this.showScreen('winnerScreen');
    }
    
    playAgain() {
        this.showScreen('registrationScreen');
        // Reset input fields
        document.getElementById('player1Name').value = '';
        document.getElementById('player2Name').value = '';
        this.validatePlayerNames();
    }
    
    endGame() {
        this.gameOver = true;
        this.updateGameStatus(`🎉 ${this.playerNames[this.currentPlayer - 1]} ชนะ! 🎉`);
        document.getElementById('rollButton').disabled = true;
        document.getElementById('questionModal').style.display = 'none';
        
        // Add celebration animation
        document.querySelector('.scratch-cat').style.animation = 'bounce 0.5s infinite';
    }
    
    initializeQuestions() {
        return {
            motion: [
                {
                    category: "การเคลื่อนไหว",
                    question: "บล็อกใดใช้สำหรับเคลื่อนที่ไปข้างหน้า?",
                    options: ["move 10 steps", "turn 15 degrees", "go to x:0 y:0", "point in direction 90"],
                    correctAnswer: 0
                },
                {
                    category: "การเคลื่อนไหว",
                    question: "บล็อกใดใช้สำหรับหมุนตัวละคร?",
                    options: ["move 10 steps", "turn 15 degrees", "set x to 0", "change y by 10"],
                    correctAnswer: 1
                },
                {
                    category: "การเคลื่อนไหว",
                    question: "บล็อก 'glide' ใช้สำหรับอะไร?",
                    options: ["เคลื่อนที่แบบเรียบ", "หมุนตัว", "กระโดด", "หยุดการเคลื่อนไหว"],
                    correctAnswer: 0
                },
                {
                    category: "การเคลื่อนไหว",
                    question: "จะหมุนตัวละครไปทางซ้ายใช้บล็อกใด?",
                    options: ["turn clockwise", "turn counter-clockwise", "point in direction 90", "go to x:0 y:0"],
                    correctAnswer: 1
                },
                {
                    category: "การเคลื่อนไหว",
                    question: "บล็อก 'bounce if on edge' ทำอะไร?",
                    options: ["เด้งเมื่อชนขอบ", "หยุดเมื่อชนขอบ", "ซ่อนตัวเมื่อชนขอบ", "เปลี่ยนสีเมื่อชนขอบ"],
                    correctAnswer: 0
                },
                {
                    category: "การเคลื่อนไหว",
                    question: "ถ้าต้องการย้ายตัวละครไปมุมซ้ายบน ใช้บล็อกใด?",
                    options: ["go to x:240 y:180", "go to x:-240 y:180", "go to x:0 y:0", "go to x:240 y:-180"],
                    correctAnswer: 1
                },
                {
                    category: "การเคลื่อนไหว",
                    question: "บล็อก 'change x by 10' ทำอะไร?",
                    options: ["เปลี่ยนตำแหน่ง x เพิ่ม 10", "เปลี่ยนตำแหน่ง y เพิ่ม 10", "หมุน 10 องศา", "ขยายขนาด 10 เท่า"],
                    correctAnswer: 0
                },
                {
                    category: "การเคลื่อนไหว",
                    question: "บล็อก 'set rotation style' ใช้สำหรับอะไร?",
                    options: ["ตั้งขนาด", "ตั้งวิธีหมุน", "ตั้งสี", "ตั้งตำแหน่ง"],
                    correctAnswer: 1
                },
                {
                    category: "การเคลื่อนไหว",
                    question: "ตัวละครจะหันหน้ามาทางผู้ใช้เมื่อใช้บล็อกใด?",
                    options: ["point in direction 90", "point towards mouse-pointer", "point towards edge", "point up"],
                    correctAnswer: 1
                },
                {
                    category: "การเคลื่อนไหว",
                    question: "บล็อก 'go to random position' ทำอะไร?",
                    options: ["ไปตำแหน่งสุ่ม", "ไปตำแหน่งเดิม", "ไปตำแหน่งศูนย์กลาง", "ไปตำแหน่งขอบ"],
                    correctAnswer: 0
                }
            ],
            looks: [
                {
                    category: "รูปลักษณ์",
                    question: "บล็อกใดใช้สำหรับพูดข้อความ?",
                    options: ["say Hello!", "think Hmm...", "show", "change color effect"],
                    correctAnswer: 0
                },
                {
                    category: "รูปลักษณ์",
                    question: "บล็อกใดใช้สำหรับซ่อนตัวละคร?",
                    options: ["show", "hide", "set size to 100%", "go to front layer"],
                    correctAnswer: 1
                },
                {
                    category: "รูปลักษณ์",
                    question: "บล็อก 'think' แตกต่างจาก 'say' อย่างไร?",
                    options: ["แสดงเป็นบอลลูน", "แสดงเป็นฟองคิด", "แสดงเป็นตัวหนา", "ไม่มีความแตกต่าง"],
                    correctAnswer: 1
                },
                {
                    category: "รูปลักษณ์",
                    question: "บล็อก 'switch costume' ใช้สำหรับอะไร?",
                    options: ["เปลี่ยนเสื้อผ้า", "เปลี่ยนชุดภาพ", "เปลี่ยนสี", "เปลี่ยนขนาด"],
                    correctAnswer: 1
                },
                {
                    category: "รูปลักษณ์",
                    question: "บล็อก 'next costume' ทำอะไร?",
                    options: ["ไปชุดภาพถัดไป", "ไปชุดภาพก่อนหน้า", "ไปชุดภาพแรก", "ไปชุดภาพสุดท้าย"],
                    correctAnswer: 0
                },
                {
                    category: "รูปลักษณ์",
                    question: "บล็อก 'change size by 10' ทำอะไร?",
                    options: ["ขยายขนาดเพิ่ม 10%", "ลดขนาด 10%", "เปลี่ยนเป็นขนาด 10", "ไม่เปลี่ยนขนาด"],
                    correctAnswer: 0
                },
                {
                    category: "รูปลักษณ์",
                    question: "บล็อก 'set ghost effect to 50' ทำอะไร?",
                    options: ["ทำให้โปร่งใส 50%", "ทำให้มีสี 50%", "ทำให้ขยาย 50%", "ทำให้หมุน 50 องศา"],
                    correctAnswer: 0
                },
                {
                    category: "รูปลักษณ์",
                    question: "บล็อก 'go to front layer' ทำอะไร?",
                    options: ["ไปชั้นหลัง", "ไปชั้นหน้า", "ไปชั้นกลาง", "ไปชั้นล่าง"],
                    correctAnswer: 1
                },
                {
                    category: "รูปลักษณ์",
                    question: "บล็อก 'switch backdrop' ใช้สำหรับอะไร?",
                    options: ["เปลี่ยนตัวละคร", "เปลี่ยนพื้นหลัง", "เปลี่ยนเสียง", "เปลี่ยนโปรแกรม"],
                    correctAnswer: 1
                },
                {
                    category: "รูปลักษณ์",
                    question: "บล็อก 'clear graphic effects' ทำอะไร?",
                    options: ["เพิ่มเอฟเฟกต์", "ลบเอฟเฟกต์ทั้งหมด", "เปลี่ยนเอฟเฟกต์", "ซ่อนเอฟเฟกต์"],
                    correctAnswer: 1
                }
            ],
            sound: [
                {
                    category: "เสียง",
                    question: "บล็อกใดใช้สำหรับเล่นเสียง?",
                    options: ["play sound Meow", "set volume to 100%", "change pitch by 10", "stop all sounds"],
                    correctAnswer: 0
                },
                {
                    category: "เสียง",
                    question: "บล็อกใดใช้สำหรับหยุดเสียงทั้งหมด?",
                    options: ["play sound Pop", "set volume to 0%", "stop all sounds", "change tempo by 20"],
                    correctAnswer: 2
                },
                {
                    category: "เสียง",
                    question: "บล็อก 'play sound until done' แตกต่างจาก 'start sound' อย่างไร?",
                    options: ["เล่นจนจบค่อยทำต่อ", "เล่นแล้วทำต่อทันที", "เล่นแบบวนซ้ำ", "ไม่มีความแตกต่าง"],
                    correctAnswer: 0
                },
                {
                    category: "เสียง",
                    question: "บล็อก 'change volume by -10' ทำอะไร?",
                    options: ["เพิ่มเสียง 10", "ลดเสียง 10", "ตั้งเสียงเป็น 10", "ปิดเสียง"],
                    correctAnswer: 1
                },
                {
                    category: "เสียง",
                    question: "บล็อก 'set volume to 0' ทำอะไร?",
                    options: ["เปิดเสียงเต็ม", "ปิดเสียง", "ลดเสียงครึ่งหนึ่ง", "เพิ่มเสียงสองเท่า"],
                    correctAnswer: 1
                },
                {
                    category: "เสียง",
                    question: "บล็อก 'change pitch by 10' ทำอะไร?",
                    options: ["เปลี่ยนระดับเสียงให้สูงขึ้น", "เปลี่ยนระดับเสียงให้ต่ำลง", "เปลี่ยนความดังของเสียง", "เปลี่ยนความเร็วของเสียง"],
                    correctAnswer: 0
                },
                {
                    category: "เสียง",
                    question: "บล็อก 'set tempo to 60' ทำอะไร?",
                    options: ["ตั้งความดัง", "ตั้งจังหวะ", "ตั้งระดับเสียง", "ตั้งความยาวเสียง"],
                    correctAnswer: 1
                },
                {
                    category: "เสียง",
                    question: "บล็อก 'change tempo by 20' ทำอะไร?",
                    options: ["เร็วขึ้น 20", "ช้าลง 20", "ดังขึ้น 20", "เบาลง 20"],
                    correctAnswer: 0
                },
                {
                    category: "เสียง",
                    question: "บล็อก 'set sound effect to robot' ทำอะไร?",
                    options: ["เล่นเสียงหุ่นยนต์", "เปลี่ยนเสียงให้เหมือนหุ่นยนต์", "หยุดเสียงหุ่นยนต์", "บันทึกเสียงหุ่นยนต์"],
                    correctAnswer: 1
                },
                {
                    category: "เสียง",
                    question: "บล็อก 'clear sound effects' ทำอะไร?",
                    options: ["เพิ่มเอฟเฟกต์เสียง", "ลบเอฟเฟกต์เสียงทั้งหมด", "เปลี่ยนเอฟเฟกต์เสียง", "ซ่อนเอฟเฟกต์เสียง"],
                    correctAnswer: 1
                }
            ],
            sensing: [
                {
                    category: "การตรวจจับ",
                    question: "บล็อกใดใช้สำหรับตรวจจับการสัมผัส?",
                    options: ["touching mouse-pointer?", "key space pressed?", "distance to mouse-pointer", "timer"],
                    correctAnswer: 0
                },
                {
                    category: "การตรวจจับ",
                    question: "บล็อกใดใช้สำหรับตรวจจับการกดปุ่มคีย์บอร์ด?",
                    options: ["mouse down?", "key space pressed?", "touching color blue?", "loudness"],
                    correctAnswer: 1
                },
                {
                    category: "การตรวจจับ",
                    question: "บล็อก 'mouse down?' ตรวจจับอะไร?",
                    options: ["การกดเมาส์", "การปล่อยเมาส์", "การเลื่อนเมาส์", "ตำแหน่งเมาส์"],
                    correctAnswer: 0
                },
                {
                    category: "การตรวจจับ",
                    question: "บล็อก 'distance to mouse-pointer' ให้ข้อมูลอะไร?",
                    options: ["ระยะห่างจากเมาส์", "ตำแหน่งเมาส์", "ความเร็วเมาส์", "สีที่เมาส์ชี้"],
                    correctAnswer: 0
                },
                {
                    category: "การตรวจจับ",
                    question: "บล็อก 'loudness' วัดอะไร?",
                    options: ["ความสว่าง", "ความดังของเสียง", "ความเร็ว", "ความร้อน"],
                    correctAnswer: 1
                },
                {
                    category: "การตรวจจับ",
                    question: "บล็อก 'timer' ทำอะไร?",
                    options: ["นับเวลาที่ผ่านไป", "ตั้งเวลา", "หยุดเวลา", "รีเซ็ตเวลา"],
                    correctAnswer: 0
                },
                {
                    category: "การตรวจจับ",
                    question: "บล็อก 'reset timer' ทำอะไร?",
                    options: ["เริ่มนับเวลาใหม่", "หยุดนับเวลา", "ดูเวลาปัจจุบัน", "ตั้งเวลาใหม่"],
                    correctAnswer: 0
                },
                {
                    category: "การตรวจจับ",
                    question: "บล็อก 'touching color blue?' ตรวจจับอะไร?",
                    options: ["การสัมผัสสีน้ำเงิน", "การสัมผัสสีแดง", "การสัมผัสสีเขียว", "การสัมผัสสีเหลือง"],
                    correctAnswer: 0
                },
                {
                    category: "การตรวจจับ",
                    question: "บล็อก 'current year' ให้ข้อมูลอะไร?",
                    options: ["ปีปัจจุบัน", "เดือนปัจจุบัน", "วันปัจจุบัน", "เวลาปัจจุบัน"],
                    correctAnswer: 0
                },
                {
                    category: "การตรวจจับ",
                    question: "บล็อก 'username' ให้ข้อมูลอะไร?",
                    options: ["ชื่อผู้ใช้", "รหัสผ่าน", "อีเมล", "ชื่อโปรเจ็กต์"],
                    correctAnswer: 0
                }
            ],
            operators: [
                {
                    category: "ตัวดำเนินการ",
                    question: "สัญลักษณ์ใดใช้สำหรับการบวก?",
                    options: ["-", "+", "*", "/"],
                    correctAnswer: 1
                },
                {
                    category: "ตัวดำเนินการ",
                    question: "บล็อก 'and' ใช้สำหรับอะไร?",
                    options: ["การบวก", "การเชื่อมเงื่อนไข", "การลบ", "การหาร"],
                    correctAnswer: 1
                },
                {
                    category: "ตัวดำเนินการ",
                    question: "บล็อก 'or' ใช้สำหรับอะไร?",
                    options: ["การหาร", "เงื่อนไขหรือ", "การคูณ", "การลบ"],
                    correctAnswer: 1
                },
                {
                    category: "ตัวดำเนินการ",
                    question: "บล็อก 'not' ทำอะไร?",
                    options: ["กลับค่าตรรกะ", "ไม่ทำอะไร", "ลบตัวเลข", "เพิ่มตัวเลข"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวดำเนินการ",
                    question: "บล็อก 'random 1 to 10' ให้ผลลัพธ์อะไร?",
                    options: ["ตัวเลขสุ่ม 1-10", "ตัวเลขสุ่ม 0-10", "ตัวเลขสุ่ม 1-100", "ตัวเลขสุ่ม 0-1"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวดำเนินการ",
                    question: "บล็อก 'join hello world' ทำอะไร?",
                    options: ["แยกข้อความ", "รวมข้อความ", "ลบข้อความ", "เปลี่ยนข้อความ"],
                    correctAnswer: 1
                },
                {
                    category: "ตัวดำเนินการ",
                    question: "บล็อก 'length of hello' ให้ผลลัพธ์อะไร?",
                    options: ["ความยาวของข้อความ", "ความกว้างของข้อความ", "ขนาดของข้อความ", "สีของข้อความ"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวดำเนินการ",
                    question: "บล็อก 'mod' ใช้สำหรับอะไร?",
                    options: ["หาเศษจากการหาร", "หาผลจากการหาร", "หาผลรวม", "หาผลต่าง"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวดำเนินการ",
                    question: "บล็อก 'round 3.7' ให้ผลลัพธ์อะไร?",
                    options: ["3", "4", "3.7", "7"],
                    correctAnswer: 1
                },
                {
                    category: "ตัวดำเนินการ",
                    question: "บล็อก 'contains hello apple?' ตรวจสอบอะไร?",
                    options: ["apple อยู่ใน hello หรือไม่", "hello อยู่ใน apple หรือไม่", "hello เท่ากับ apple หรือไม่", "apple มากกว่า hello หรือไม่"],
                    correctAnswer: 0
                }
            ],
            variables: [
                {
                    category: "ตัวแปร",
                    question: "ตัวแปรใช้สำหรับอะไร?",
                    options: ["เก็บข้อมูล", "เล่นเสียง", "เคลื่อนที่", "เปลี่ยนสี"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวแปร",
                    question: "บล็อกใดใช้สำหรับเปลี่ยนค่าตัวแปร?",
                    options: ["set my variable to 0", "show variable", "hide variable", "delete variable"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวแปร",
                    question: "บล็อก 'change my variable by 1' ทำอะไร?",
                    options: ["เพิ่มค่าตัวแปร 1", "ลดค่าตัวแปร 1", "ตั้งค่าตัวแปรเป็น 1", "ลบตัวแปร"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวแปร",
                    question: "บล็อก 'show variable' ทำอะไร?",
                    options: ["แสดงตัวแปรบนเวที", "ซ่อนตัวแปร", "ลบตัวแปร", "เปลี่ยนชื่อตัวแปร"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวแปร",
                    question: "บล็อก 'hide variable' ทำอะไร?",
                    options: ["แสดงตัวแปร", "ซ่อนตัวแปรจากเวที", "ลบตัวแปร", "เปลี่ยนค่าตัวแปร"],
                    correctAnswer: 1
                },
                {
                    category: "ตัวแปร",
                    question: "List (รายการ) ใช้สำหรับอะไร?",
                    options: ["เก็บข้อมูลหลายค่า", "เก็บข้อมูลค่าเดียว", "เล่นเสียง", "เปลี่ยนสี"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวแปร",
                    question: "บล็อก 'add thing to my list' ทำอะไร?",
                    options: ["เพิ่มข้อมูลในรายการ", "ลบข้อมูลจากรายการ", "แสดงรายการ", "ซ่อนรายการ"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวแปร",
                    question: "บล็อก 'delete 1 of my list' ทำอะไร?",
                    options: ["ลบข้อมูลลำดับที่ 1", "เพิ่มข้อมูลลำดับที่ 1", "แสดงข้อมูลลำดับที่ 1", "เปลี่ยนข้อมูลลำดับที่ 1"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวแปร",
                    question: "บล็อก 'length of my list' ให้ผลลัพธ์อะไร?",
                    options: ["จำนวนข้อมูลในรายการ", "ความยาวของข้อมูล", "ขนาดของรายการ", "ตำแหน่งของรายการ"],
                    correctAnswer: 0
                },
                {
                    category: "ตัวแปร",
                    question: "บล็อก 'my list contains thing' ตรวจสอบอะไร?",
                    options: ["ข้อมูลอยู่ในรายการหรือไม่", "รายการว่างหรือไม่", "รายการเต็มหรือไม่", "รายการถูกต้องหรือไม่"],
                    correctAnswer: 0
                }
            ],
            events: [
                {
                    category: "เหตุการณ์",
                    question: "บล็อกใดใช้สำหรับเริ่มโปรแกรม?",
                    options: ["when green flag clicked", "when space key pressed", "when this sprite clicked", "when backdrop switches"],
                    correctAnswer: 0
                },
                {
                    category: "เหตุการณ์",
                    question: "บล็อกใดใช้เมื่อกดตัวละคร?",
                    options: ["when green flag clicked", "when key pressed", "when this sprite clicked", "when timer > 10"],
                    correctAnswer: 2
                },
                {
                    category: "เหตุการณ์",
                    question: "บล็อก 'when space key pressed' ทำงานเมื่อไหร่?",
                    options: ["เมื่อกดปุ่ม space", "เมื่อกดปุ่มใดๆ", "เมื่อกดเมาส์", "เมื่อเริ่มโปรแกรม"],
                    correctAnswer: 0
                },
                {
                    category: "เหตุการณ์",
                    question: "บล็อก 'when backdrop switches' ทำงานเมื่อไหร่?",
                    options: ["เมื่อเปลี่ยนพื้นหลัง", "เมื่อเปลี่ยนตัวละคร", "เมื่อเปลี่ยนเสียง", "เมื่อเปลี่ยนขนาด"],
                    correctAnswer: 0
                },
                {
                    category: "เหตุการณ์",
                    question: "บล็อก 'when loudness > 10' ทำงานเมื่อไหร่?",
                    options: ["เมื่อเสียงดังเกิน 10", "เมื่อเสียงเบากว่า 10", "เมื่อเสียงเท่ากับ 10", "เมื่อไม่มีเสียง"],
                    correctAnswer: 0
                },
                {
                    category: "เหตุการณ์",
                    question: "บล็อก 'when timer > 10' ทำงานเมื่อไหร่?",
                    options: ["เมื่อเวลาผ่านไปเกิน 10 วินาที", "เมื่อเวลาน้อยกว่า 10 วินาที", "เมื่อเวลาเท่ากับ 10 วินาที", "เมื่อรีเซ็ตเวลา"],
                    correctAnswer: 0
                },
                {
                    category: "เหตุการณ์",
                    question: "บล็อก 'broadcast message1' ทำอะไร?",
                    options: ["ส่งข้อความไปยังตัวละครอื่น", "รับข้อความจากตัวละครอื่น", "ลบข้อความ", "แสดงข้อความ"],
                    correctAnswer: 0
                },
                {
                    category: "เหตุการณ์",
                    question: "บล็อก 'when I receive message1' ทำงานเมื่อไหร่?",
                    options: ["เมื่อได้รับข้อความ message1", "เมื่อส่งข้อความ message1", "เมื่อลบข้อความ message1", "เมื่อเปลี่ยนข้อความ message1"],
                    correctAnswer: 0
                },
                {
                    category: "เหตุการณ์",
                    question: "บล็อก 'broadcast message1 and wait' แตกต่างจาก 'broadcast message1' อย่างไร?",
                    options: ["รอให้ทำงานเสร็จก่อน", "ไม่รอให้ทำงานเสร็จ", "ส่งข้อความช้าลง", "ส่งข้อความเร็วขึ้น"],
                    correctAnswer: 0
                },
                {
                    category: "เหตุการณ์",
                    question: "บล็อก 'when I start as a clone' ทำงานเมื่อไหร่?",
                    options: ["เมื่อโคลนถูกสร้างขึ้น", "เมื่อโคลนถูกลบ", "เมื่อตัวละครหลักเริ่มทำงาน", "เมื่อโปรแกรมสิ้นสุด"],
                    correctAnswer: 0
                }
            ],
            control: [
                {
                    category: "ควบคุม",
                    question: "บล็อกใดใช้สำหรับการวนลูป?",
                    options: ["if then", "repeat 10", "wait 1 seconds", "stop all"],
                    correctAnswer: 1
                },
                {
                    category: "ควบคุม",
                    question: "บล็อก 'if then' ใช้สำหรับอะไร?",
                    options: ["วนลูป", "ตรวจสอบเงื่อนไข", "หยุดโปรแกรม", "รอเวลา"],
                    correctAnswer: 1
                },
                {
                    category: "ควบคุม",
                    question: "บล็อก 'if then else' แตกต่างจาก 'if then' อย่างไร?",
                    options: ["มีทางเลือกเมื่อเงื่อนไขเป็นเท็จ", "มีทางเลือกเมื่อเงื่อนไขเป็นจริง", "ไม่มีความแตกต่าง", "ทำงานช้าลง"],
                    correctAnswer: 0
                },
                {
                    category: "ควบคุม",
                    question: "บล็อก 'wait 1 seconds' ทำอะไร?",
                    options: ["รอ 1 วินาที", "รอ 1 นาที", "รอ 1 ชั่วโมง", "ไม่รอเลย"],
                    correctAnswer: 0
                },
                {
                    category: "ควบคุม",
                    question: "บล็อก 'repeat until' ทำอะไร?",
                    options: ["ทำซ้ำจนกว่าเงื่อนไขจะเป็นจริง", "ทำซ้ำจนกว่าเงื่อนไขจะเป็นเท็จ", "ทำซ้ำตลอดไป", "ทำแค่ครั้งเดียว"],
                    correctAnswer: 0
                },
                {
                    category: "ควบคุม",
                    question: "บล็อก 'forever' ทำอะไร?",
                    options: ["ทำซ้ำตลอดไป", "ทำแค่ครั้งเดียว", "ทำ 10 ครั้ง", "ไม่ทำอะไร"],
                    correctAnswer: 0
                },
                {
                    category: "ควบคุม",
                    question: "บล็อก 'stop all' ทำอะไร?",
                    options: ["หยุดทุกอย่าง", "หยุดตัวละครนี้", "หยุดตัวละครอื่น", "หยุดเสียง"],
                    correctAnswer: 0
                },
                {
                    category: "ควบคุม",
                    question: "บล็อก 'stop this script' ทำอะไร?",
                    options: ["หยุดสคริปต์นี้", "หยุดสคริปต์อื่น", "หยุดทุกสคริปต์", "หยุดโปรแกรม"],
                    correctAnswer: 0
                },
                {
                    category: "ควบคุม",
                    question: "บล็อก 'create clone of myself' ทำอะไร?",
                    options: ["สร้างสำเนาของตัวเอง", "ลบสำเนาของตัวเอง", "เปลี่ยนตัวเอง", "ซ่อนตัวเอง"],
                    correctAnswer: 0
                },
                {
                    category: "ควบคุม",
                    question: "บล็อก 'delete this clone' ทำอะไร?",
                    options: ["ลบโคลนนี้", "สร้างโคลนใหม่", "แสดงโคลนนี้", "ซ่อนโคลนนี้"],
                    correctAnswer: 0
                }
            ],
            "more-blocks": [
                {
                    category: "บล็อกเพิ่มเติม",
                    question: "บล็อกเพิ่มเติมใช้สำหรับอะไร?",
                    options: ["สร้างฟังก์ชันใหม่", "เล่นเสียง", "เคลื่อนที่", "เปลี่ยนสี"],
                    correctAnswer: 0
                },
                {
                    category: "บล็อกเพิ่มเติม",
                    question: "การสร้าง 'My Block' คืออะไร?",
                    options: ["การลบบล็อก", "การสร้างฟังก์ชันใหม่", "การคัดลอกบล็อก", "การซ่อนบล็อก"],
                    correctAnswer: 1
                },
                {
                    category: "บล็อกเพิ่มเติม",
                    question: "ข้อดีของการสร้างบล็อกใหม่คืออะไร?",
                    options: ["ทำให้โค้ดซับซ้อน", "ทำให้โค้ดใช้ซ้ำได้", "ทำให้โค้ดช้าลง", "ทำให้โค้ดผิดพลาด"],
                    correctAnswer: 1
                },
                {
                    category: "บล็อกเพิ่มเติม",
                    question: "บล็อกที่สร้างขึ้นใหม่สามารถมีอะไรได้บ้าง?",
                    options: ["Input และ Label", "เฉพาะ Input", "เฉพาะ Label", "ไม่มีอะไรเลย"],
                    correctAnswer: 0
                },
                {
                    category: "บล็อกเพิ่มเติม",
                    question: "การใส่ 'Run without screen refresh' ทำอะไร?",
                    options: ["ทำงานเร็วขึ้น", "ทำงานช้าลง", "ไม่มีผลอะไร", "ทำให้ผิดพลาด"],
                    correctAnswer: 0
                },
                {
                    category: "บล็อกเพิ่มเติม",
                    question: "บล็อกที่สร้างขึ้นสามารถเรียกใช้ที่ไหนได้บ้าง?",
                    options: ["เฉพาะใน Sprite นี้", "ใน Sprite ทุกตัว", "เฉพาะใน Project นี้", "ไม่สามารถเรียกใช้ได้"],
                    correctAnswer: 1
                },
                {
                    category: "บล็อกเพิ่มเติม",
                    question: "Input ในบล็อกที่สร้างขึ้นใช้สำหรับอะไร?",
                    options: ["รับค่าจากภายนอก", "ส่งค่าออกไปข้างนอก", "แสดงผลลัพธ์", "ไม่มีประโยชน์"],
                    correctAnswer: 0
                },
                {
                    category: "บล็อกเพิ่มเติม",
                    question: "การตั้งชื่อบล็อกใหม่ควรเป็นอย่างไร?",
                    options: ["สั้นและชัดเจน", "ยาวและซับซ้อน", "ใช้ตัวเลขเท่านั้น", "ไม่สำคัญ"],
                    correctAnswer: 0
                },
                {
                    category: "บล็อกเพิ่มเติม",
                    question: "บล็อกที่สร้างขึ้นสามารถเรียกใช้ตัวเองได้หรือไม่?",
                    options: ["ได้ (Recursion)", "ไม่ได้", "ได้แค่ 1 ครั้ง", "ได้แค่ 10 ครั้ง"],
                    correctAnswer: 0
                },
                {
                    category: "บล็อกเพิ่มเติม",
                    question: "การลบบล็อกที่สร้างขึ้นจะเกิดอะไรขึ้น?",
                    options: ["บล็อกที่ใช้งานจะหายไป", "ไม่มีผลอะไร", "โปรแกรมจะผิดพลาด", "บล็อกจะถูกซ่อน"],
                    correctAnswer: 0
                }
            ],
            general: [
                {
                    category: "ความรู้ทั่วไป",
                    question: "Scratch ถูกพัฒนาโดยสถาบันใด?",
                    options: ["Google", "MIT", "Microsoft", "Apple"],
                    correctAnswer: 1
                },
                {
                    category: "ความรู้ทั่วไป",
                    question: "ตัวละครหลักของ Scratch ชื่ออะไร?",
                    options: ["Scratch Dog", "Scratch Cat", "Scratch Bird", "Scratch Fish"],
                    correctAnswer: 1
                },
                {
                    category: "ความรู้ทั่วไป",
                    question: "Scratch เป็นภาษาโปรแกรมแบบใด?",
                    options: ["Text-based", "Visual/Block-based", "Command-line", "Assembly"],
                    correctAnswer: 1
                },
                {
                    category: "ความรู้ทั่วไป",
                    question: "พื้นที่ที่ตัวละครแสดงผลเรียกว่าอะไร?",
                    options: ["Canvas", "Stage", "Screen", "Board"],
                    correctAnswer: 1
                },
                {
                    category: "ความรู้ทั่วไป",
                    question: "ตัวละครใน Scratch เรียกว่าอะไร?",
                    options: ["Character", "Sprite", "Actor", "Figure"],
                    correctAnswer: 1
                },
                {
                    category: "ความรู้ทั่วไป",
                    question: "ไฟล์โปรเจ็กต์ของ Scratch มีนามสกุลอะไร?",
                    options: [".scratch", ".sb3", ".scr", ".project"],
                    correctAnswer: 1
                },
                {
                    category: "ความรู้ทั่วไป",
                    question: "Scratch ออกแบบมาสำหรับใคร?",
                    options: ["โปรแกรมเมอร์มืออาชีพ", "เด็กและผู้เริ่มต้น", "นักวิจัย", "ครูเท่านั้น"],
                    correctAnswer: 1
                },
                {
                    category: "ความรู้ทั่วไป",
                    question: "Scratch Community คืออะไร?",
                    options: ["ร้านค้า", "ชุมชนแชร์ผลงาน", "โรงเรียน", "บริษัท"],
                    correctAnswer: 1
                },
                {
                    category: "ความรู้ทั่วไป",
                    question: "ปุ่มธงเขียวใช้สำหรับอะไร?",
                    options: ["หยุดโปรแกรม", "เริ่มโปรแกรม", "บันทึกโปรแกรม", "ลบโปรแกรม"],
                    correctAnswer: 1
                },
                {
                    category: "ความรู้ทั่วไป",
                    question: "ปุ่มแปดเหลี่ยมแดงใช้สำหรับอะไร?",
                    options: ["เริ่มโปรแกรม", "หยุดโปรแกรม", "บันทึกโปรแกรม", "เปิดโปรแกรม"],
                    correctAnswer: 1
                }
            ]
        };
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ScratchBoardGame();
});
