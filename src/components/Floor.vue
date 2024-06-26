<template>
  <div
    :class="['floor', { active: floor.number === elevator.currentFloor, called: floor.called, passengerCalled: floor.number === elevator.passengerTargetFloor }]"
    @click="callElevator"
  >
    <span>{{ floor.number }}</span>
  </div>
</template>

<script>
export default {
  name: 'Floor',
  props: {
    floor: Object,
    elevator: Object,
  },
  methods: {
    callElevator() {
      this.$emit('call-elevator', this.floor.number);
    },
  },
};
</script>

<style scoped src="../styles/Floor.css"></style>
