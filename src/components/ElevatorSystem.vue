<template>
  <div class="elevator-system">
    <Controls 
      @add-floor="addFloor" 
      @remove-floor="removeFloor" 
      @add-elevator="addElevator" 
      @remove-elevator="removeElevator" 
    />
    <div class="shafts">
      <ElevatorShaft 
        v-for="(elevator, index) in elevators" 
        :key="elevator.id" 
        :elevator="elevator" 
        :floors="floors" 
        :floorHeight="floorHeight" 
        @call-elevator="callElevator" 
      />
    </div>
    <div class="add-passenger-btn">
      <button @click="addPassenger">Добавить пассажира</button>
    </div>
  </div>
</template>

<script>
import Controls from './Controls.vue';
import ElevatorShaft from './ElevatorShaft.vue';

export default {
  name: 'ElevatorSystem',
  components: {
    Controls,
    ElevatorShaft,
  },
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
    callElevator(floorNumber, elevator) {
      if (!elevator.calls.includes(floorNumber)) {
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
      }, duration);
    },
    allElevatorsInactive() {
      return this.elevators.every(elevator => elevator.calls.length === 0 && !elevator.moving);
    },
  },
};
</script>

<style scoped src="../styles/ElevatorSystem.css"></style>
