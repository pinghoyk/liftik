<template>
  <div class="elevator-system">
    <div class="controls">
      <button @click="addFloor">Этаж +</button>
      <button @click="removeFloor">Этаж -</button>
      <button @click="addElevator">Лифт +</button>
      <button @click="removeElevator">Лифт -</button>
      <button @click="addPassenger">Добавить пассажира</button>
    </div>
    <div class="shafts">
      <div class="elevator-shaft" v-for="(elevator, index) in elevators" :key="elevator.id" :style="{ height: `${floorHeight * floors.length}px` }">
        <div class="floors">
          <div
            v-for="floor in floors"
            :key="floor.number"
            :class="['floor', { active: floor.number === elevator.currentFloor, called: floor.called, passengerCalled: floor.number === elevator.passengerTargetFloor }]"
            @click="callElevator(floor.number)"
          >
            <span>{{ floor.number }}</span>
          </div>
        </div>
        <div
          class="elevator"
          :style="{ transform: `translateY(${elevator.position}px)` }"
        >
          <div class="elevator-content">
            <p>{{ elevator.currentFloor }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElevatorSystem',
  data() {
    return {
      maxFloors: 8,
      minFloors: 2,
      maxElevators: 5,
      floors: Array.from({ length: 8 }, (_, i) => ({ number: 8 - i, called: false })),
      elevators: [
        { id: 1, currentFloor: 1, position: 0, calls: [], moving: false, passengers: [], passengerTargetFloor: null },
      ],
      nextElevatorId: 2,
      floorHeight: 80,
    };
  },
  methods: {
    addFloor() {
      if (this.floors.length < this.maxFloors) {
        const newFloor = { number: this.floors.length + 1, called: false };
        this.floors.unshift(newFloor);
      }
    },
    removeFloor() {
      if (this.floors.length > this.minFloors) {
        this.floors.shift();
      }
    },
    addElevator() {
      if (this.elevators.length < this.maxElevators) {
        this.elevators.push({
          id: this.nextElevatorId++,
          currentFloor: 1,
          position: 0,
          calls: [],
          moving: false,
          passengers: [],
          passengerTargetFloor: null,
        });
      }
    },
    removeElevator() {
      if (this.elevators.length > 1) {
        this.elevators.pop();
      }
    },
    addPassenger() {
      const randomFloor = Math.floor(Math.random() * this.floors.length) + 1;
      const randomTargetFloor = Math.floor(Math.random() * this.floors.length) + 1;
      const elevator = this.findBestElevator(randomFloor);

      if (elevator) {
        elevator.calls.push(randomFloor);
        elevator.passengers.push(randomTargetFloor);
        elevator.passengerTargetFloor = randomFloor;
        this.processCalls(elevator);
      }
    },
    callElevator(floorNumber) {
      const elevator = this.findBestElevator(floorNumber);
      if (elevator && !elevator.calls.includes(floorNumber)) {
        elevator.calls.push(floorNumber);
        elevator.calls.sort((a, b) => b - a);
        this.processCalls(elevator);
      }
    },
    findBestElevator(floor) {
      let bestElevator = null;
      let minDistance = Infinity;

      this.elevators.forEach(elevator => {
        const distance = Math.abs(elevator.currentFloor - floor);
        if (!elevator.moving && distance < minDistance) {
          minDistance = distance;
          bestElevator = elevator;
        }
      });

      return bestElevator;
    },
    processCalls(elevator) {
      if (elevator.moving || elevator.calls.length === 0) {
        if (this.allElevatorsInactive()) {
          elevator.calls.push(1);
        }
        return;
      }
      elevator.moving = true;
      const nextFloor = elevator.calls.shift();
      this.moveElevator(elevator, nextFloor);
    },
    moveElevator(elevator, targetFloor) {
      const distance = Math.abs(targetFloor - elevator.currentFloor) * this.floorHeight;
      const duration = Math.sqrt(distance) * 200;

      elevator.position = -(targetFloor - 1) * this.floorHeight;
      elevator.currentFloor = targetFloor;
      setTimeout(() => {
        elevator.moving = false;
        if (elevator.passengerTargetFloor === targetFloor) {
          elevator.passengerTargetFloor = null;
        }
        this.processCalls(elevator);
        if (elevator.calls.length === 0 && elevator.currentFloor !== 1) {
          elevator.calls.push(1);
          this.processCalls(elevator);
        }
      }, duration);
    },
    allElevatorsInactive() {
      return this.elevators.every(elevator => elevator.calls.length === 0 && !elevator.moving);
    },
  },
};
</script>

<style scoped>
.elevator-system {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  background-color: #e6e6fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.controls {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.controls button {
  margin: 5px;
  padding: 5px 10px;
  font-size: 14px;
  background-color: #9370db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.controls button:hover {
  background-color: #8a2be2;
}

.shafts {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  flex-wrap: wrap;
  gap: 10px;
}

.elevator-shaft {
  position: relative;
  width: 80px;
  border: 2px solid #d8bfd8;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
  margin: 0 5px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.floors {
  display: flex;
  flex-direction: column;
}

.floor {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.floor span {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.floor.active {
  background-color: #dda0dd;
}

.floor.called {
  background-color: #db7093;
}

.floor.passengerCalled {
  background-color: #ff69b4;
}

.elevator {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  background-color: #9370db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  transition: transform 1s cubic-bezier(0.42, 0, 0.58, 1);
}

.elevator-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
}
</style>
