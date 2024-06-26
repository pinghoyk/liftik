<template>
  <div class="elevator" :style="{ transform: `translateY(${elevator.position}px)` }">
    <div class="elevator-content">
      <p>{{ elevator.currentFloor }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Elevator',
  props: {
    elevator: Object,
  },
};
</script>

<style scoped src="../styles/Elevator.css"></style>
