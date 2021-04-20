<template>
  <transition name="fade">
    <modal v-if="image" @modal-close="$emit('close')">
      <card class="text-center m-2 bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-4">
          <div
            class="image-hotspots"
            @drop="dropHotspot"
            @dragover="allowDrop"
          >
            <img :src="imageUrl" @click="onImageClick"/>
            <a
              href="#"
              class="hotspot-point background-primary"
              v-for="(hotspot, index) in hotspotItems"
              :style="{ top: hotspot.position.top, left: hotspot.position.left }"
              @click="() => removeHotSpot(hotspot)"
              draggable="true"
              @dragstart="(e) => dragStart(e, index)"
              :key="index"
            >
                <span>{{index + 1}}</span>
            </a>
          </div>
        </div>

        <div class="bg-30 px-6 py-3 footer rounded-lg">
          <button type="button" class="btn btn-link text-80 font-normal h-9 px-3" @click="$emit('close')">
            {{ __('Cancel') }}
          </button>
          <button type="button" class="btn btn-default btn-primary" @click="onSave">{{ __('Update') }}</button>
        </div>
      </card>
    </modal>
  </transition>
</template>


<script>
import clickEventToRelativeUnits from '../clickEventToRelativeUnits';

export default {
  props: {
    image: Object,
  },
  data() {
    return {
      hotspots: [
        {
          position: {top: '20%', left: '38%'}
        },
        {
          position: {top: '85%', left: '75%'}
        },
        {
          position: {top: '85%', left: '48%'}
        }
      ]
    }
  },
  computed: {
    hotspotItems() {
      return this.hotspots;
    },
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
    onImageClick(e) {
      const [relativeX, relativeY] = clickEventToRelativeUnits(e, 10)
      this.hotspots.push({
        id: this.hotspots.length + 1,
        position: {
          top: `${relativeY}%`,
          left: `${relativeX}%`
        }
      })
    },
    removeHotSpot(clickedHotspot) {
      this.hotspots = this.hotspots
        .filter((h) => h !== clickedHotspot)
    },
    allowDrop(event) {
      event.preventDefault();
    },
    dropHotspot(event) {
      event.preventDefault();
      const eventData = event.dataTransfer.getData("hotspotId");
      if (eventData && !Number.isNaN(eventData)) {
        const hotspotIndex = Number.parseInt(eventData)
        const hotspotToMove = this.hotspots[hotspotIndex]
        if (hotspotToMove) {
          const [relativeX, relativeY] = clickEventToRelativeUnits(event, 10)
          hotspotToMove.position = {
            top: `${relativeY}%`,
            left: `${relativeX}%`
          }
        }
      }
    },
    dragStart(event, hotspotId) {
      event.dataTransfer.setData("hotspotId", hotspotId);
    },
    onSave() {
      this.$emit('hotspots-completed', this.hotspots);
      this.$emit('close');
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400');

$spot-color: #de446e;

.hotspot-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
}

.image-hotspots {
  position: relative;

  &.is-selected {
    > img {
      filter: blur(5px);
      transition: all .5s 1s;
    }
  }

  > img {
    max-width: 100%;
    height: auto;
    display: block;
    transition: all .5s;
  }
}

.hotspot-point {
  z-index: 2;
  position: absolute;
  display: block;
  -webkit-user-drag: element;
  text-decoration: none;

  span {
    background: #fff;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.8em;
    height: 1.8em;
    border-radius: 50%;
    animation: pulse 3s ease infinite;
    transition: background .3s;
    box-shadow: 0 2px 10px rgba(#000, .2);
  }


  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    pointer-events: none;
  }

  &:before {
    z-index: -1;
    border: .15em solid rgba(#fff, .9);
    opacity: 0;
    transform: scale(2);
    transition: transform .25s, opacity .2s;
  }

  &:after {
    z-index: -2;
    background: #fff;
    animation: wave 3s linear infinite;
  }

  &:hover {

    span {
      animation: none;
      background: #fff;

      &:after {
        opacity: 1;
        transform: translate(-50%, 0) scale(1);
      }
    }

    svg {
      opacity: 1;
    }

    &:before {
      opacity: 1;
      transform: scale(1.5);
      animation: borderColor 2s linear infinite;
    }

    &:after {
      animation: none;
      opacity: 0;
    }
  }
}

.hotspots-enter-active {
  transition: all .5s 1s;
}

.hotspots-leave-active {
  transition: all .5s;
}

.hotspots-enter, .hotspots-leave-to {
  opacity: 0;
  transform: scale(.3);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes borderColor {
  0% {
    border-color: #fff;
  }
  50% {
    border-color: $spot-color;
  }
  100% {
    border-color: #fff;
  }
}

@keyframes wave {
  0% {
    opacity: 1;
    transform: scale(.8);
  }
  100% {
    opacity: 0;
    transform: scale(2);
  }
}




</style>
