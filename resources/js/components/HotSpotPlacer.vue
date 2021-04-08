<template>
  <transition name="fade">
    <modal v-if="image" @modal-close="$emit('close')" class="hotspot-modal">
      <card class="text-center hotspot-container m-2 bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-4">
          <vue-hotspot
            :init-options="hotspotConfig"
            @save-data="saveData"
            @after-delete="afterDelete"
          />
        </div>
        <div class="bg-30 px-6 py-3 footer rounded-lg">
          <button type="button" class="btn btn-link text-80 font-normal h-9 px-3" @click="$emit('close')">{{__('Cancel')}}</button>
          <button type="button" class="btn btn-default btn-primary" @click="onSave">{{__('Update')}}</button>
        </div>
      </card>
    </modal>
  </transition>
</template>

<script>
  import VueHotspot from 'vue-hotspot'

  export default {
    components: {
      VueHotspot
    },
    props: {
      image: Object,
    },
    data () {
      return {
        hotspotConfig: {
          image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601580666603&di=81d64069e781bea52d8595089ed8aea4&imgtype=0&src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F154%2F775%2F815%2Faea886e20493478a9c2f628d86e34cfc.jpg',
          editable: true,
          interactivity: 'hover',
        }
      }
    },
    computed: {
      mime() {
        // if mime type is set on direct on the file it means it is an already existing image
        // in case  taking mime type from file it means the file has been just uploaded
        return this.image.mime_type || this.image.file.type;
      },
      imageUrl() {
        return this.image ? this.image.__media_urls__.__original__ : null;
      },
    },
    watch: {
      image() {
        this.reset();
      },
    },
    methods: {
      reset() {
      },
      onSave() {

        this.$emit('hotspots-completed', 'final-test');
        this.$emit('close');
      },
      saveData (data) {
        // Do something with the list of hotspots
        console.log(data)
      },
      afterDelete () {
        // Do something after delete
        console.log('Do something after delete ...')
      }
    },
  };
</script>

<style lang="scss" scoped>
  .input-range {
    width: 100%;
    max-width: 300px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
  }

  .hotspot-modal {
    z-index: 400;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
