<template>
  <div class="controls">
    <button @click="$emit('add-floor')">Этаж +</button>
    <button @click="$emit('remove-floor')">Этаж -</button>
    <button @click="$emit('add-elevator')">Лифт +</button>
    <button @click="$emit('remove-elevator')">Лифт -</button>
  </div>
</template>

<script>
export default {
  name: 'Controls',
};
</script>

<style scoped src="../styles/Controls.css"></style>
