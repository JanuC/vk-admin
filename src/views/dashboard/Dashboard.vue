<template>
  <div class="dashboard w-full h-full flex">
    <div class="flex-1 mr-[2rem] flex flex-col">
      <div class="w-full mb-[2rem]">
        <UserInfoCard />
      </div>
      <div class="flex-1 bg-red-300"></div>
    </div>
    <div class="w-[40rem]">
      <UserOperationList />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
