        let personCurrentFloor;
        const person = document.getElementById('person');
        const selectButton = document.getElementById('select-button');
        const stopButton = document.getElementById('stop-button');
        const floorButtons = document.querySelector('.floor-buttons');
        let processStopped = false;

        const personImages = [
            'img/person1.png', 
            'img/person2.png', 
            'img/person3.png', 
            'img/person4.png', 
            'img/person5.png', 
            'img/person6.png', 
            'img/person7.png', 
            'img/person8.png', 
            'img/person9.png'
        ];

        const floorHeight = 100; // Height of each floor in pixels
        const sceneHeight = 700; // Height of the scene
        const elevatorWidth = 50; // Width of the elevator
        const personWidth = 50; // Width of the person

        function initializePerson() {
            personCurrentFloor = Math.floor(Math.random() * 7) + 1;
            const personTop = sceneHeight - (personCurrentFloor * floorHeight) - personWidth;
            person.style.top = `${personTop}px`;
            person.style.left = '350px'; // Initial position on the right
            person.style.backgroundImage = `url(${personImages[Math.floor(Math.random() * personImages.length)]})`;
            person.style.display = 'block';
        }

        function moveElevatorToFloor(targetFloor, callback) {
            const elevator = document.querySelector('.elevator');
            const floorDisplay = document.querySelector('.floor-display');
            let currentFloor = parseInt(floorDisplay.textContent);

            const targetTop = sceneHeight - (targetFloor * floorHeight);

            // Update floor display before moving
            const updateDisplay = (start, end) => {
                const step = start < end ? 1 : -1;
                const interval = setInterval(() => {
                    currentFloor += step;
                    floorDisplay.textContent = currentFloor;
                    if (currentFloor === end) {
                        clearInterval(interval);
                    }
                }, 300);
            };

            // Close doors if open
            if (elevator.classList.contains('open')) {
                elevator.classList.remove('open');
            }

            // Wait for doors to close before moving
            setTimeout(() => {
                // Move elevator to target floor
                elevator.style.top = `${targetTop}px`;

                // Update floor display during movement
                updateDisplay(currentFloor, targetFloor);

                // Open doors when arrived
                setTimeout(() => {
                    elevator.classList.add('open');
                    if (callback) {
                        callback();
                    }
                }, 3000);
            }, 1000);
        }

        function personEntersElevator(targetFloor) {
            const personTop = sceneHeight - (personCurrentFloor * floorHeight) - personWidth;
            person.style.left = `${200 - personWidth / 2}px`; // Move to the center where the elevator is

            setTimeout(() => {
                person.style.display = 'none'; // Hide the person when entering the elevator
                moveElevatorToFloor(targetFloor, () => {
                    setTimeout(() => {
                        person.style.display = 'block'; // Show the person again
                        person.style.left = `${200 - personWidth / 2}px`; // Move person to the center where the elevator is
                        person.style.top = `${sceneHeight - (targetFloor * floorHeight) - personWidth}px`; // Position on the target floor
                        setTimeout(() => {
                            person.style.left = '350px'; // Move person out to the right
                            setTimeout(() => {
                person.style.display = 'none'; // Hide the person after exiting the elevator
                                if (!processStopped) {
                                    initializePerson(); // Initialize a new person
                                    selectButton.style.display = 'block'; // Show select button for the new person
                                }
                            }, 2000); // Assuming it takes 2 seconds to move out of view
                        }, 1000);
                    }, 1000);
                });
            }, 2000); // Assuming it takes 2 seconds to move to the elevator
        }

        selectButton.addEventListener('click', () => {
            floorButtons.style.display = 'flex';
            selectButton.style.display = 'none';
            stopButton.style.display = 'block';
        });

        stopButton.addEventListener('click', () => {
            processStopped = true;
            stopButton.style.display = 'none';
        });

        document.querySelectorAll('.floor-button').forEach(button => {
            button.addEventListener('click', function() {
                const targetFloor = parseInt(this.getAttribute('data-floor'));
                moveElevatorToFloor(personCurrentFloor, () => {
                    personEntersElevator(targetFloor);
                });

                // Hide floor buttons after selection
                floorButtons.style.display = 'none';
            });
        });

        initializePerson();







        