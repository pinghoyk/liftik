<template>
  <div class="elevator-shaft" :style="{ height: `${floorHeight * floors.length}px` }">
    <div class="floors">
      <Floor
        v-for="floor in floors"
        :key="floor.number"
        :floor="floor"
        :elevator="elevator"
        @call-elevator="callElevator"
      />
    </div>
    <Elevator :elevator="elevator" />
  </div>
</template>

<script>
import Floor from './Floor.vue';
import Elevator from './Elevator.vue';

export default {
  name: 'ElevatorShaft',
  components: {
    Floor,
    Elevator,
  },
  props: {
    elevator: Object,
    floors: Array,
    floorHeight: Number,
  },
  methods: {
    callElevator(floorNumber) {
      this.$emit('call-elevator', floorNumber, this.elevator);
    },
  },
};
</script>

<style scoped src="../styles/ElevatorShaft.css"></style>
