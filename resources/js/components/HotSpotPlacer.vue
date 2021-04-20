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
              @click.prevent="hotspotClicked(hotspot, index)"
              draggable="true"
              @dragstart="(e) => dragStart(e, hotspot.id)"
              :key="index"
            >
            <span :data-price="hotspot.title">
              <svg class="hotspot-icon icon-close" viewBox="0 0 24 24">
                <path d="M18.984 12.984h-6v6h-1.969v-6h-6v-1.969h6v-6h1.969v6h6v1.969z"></path>
              </svg>
            </span>
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
          id: 1,
          title: 'iMac 27"',
          position: {top: '20%', left: '38%'}
        },
        {
          id: 2,
          title: 'Magic Mouse 2',
          position: {top: '85%', left: '75%'}
        },
        {
          id: 3,
          title: 'Magic Keyboard',
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
        // GUID maybe?
        id: this.hotspots.length,
        title: "Test",
        position: {
          top: `${relativeY}%`,
          left: `${relativeX}%`
        }
      })
    },
    allowDrop(event) {
      event.preventDefault();
    },
    dropHotspot(event) {
      event.preventDefault();
      const eventData = event.dataTransfer.getData("hotspotId");
      if (eventData && !Number.isNaN(eventData)) {
        const hotspotId = Number.parseInt(eventData)
        const hotspotToMove = this.hotspots.find((h) => h.id === hotspotId);
        if (hotspotToMove) {
          const newHotspotArray = this.hotspots.filter((h) => h.id !== hotspotToMove.id);
          const [relativeX, relativeY] = clickEventToRelativeUnits(event, 10)
          newHotspotArray.push({
            ...hotspotToMove,
            position: {
              top: `${relativeY}%`,
              left: `${relativeX}%`
            }
          })
          this.hotspots = newHotspotArray;
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

  span {
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

    &:after {
      content: attr(data-price);
      position: absolute;
      bottom: 130%;
      left: 50%;
      color: white;
      text-shadow: 0 1px black;
      font-weight: 600;
      font-size: 1.2em;
      opacity: 0;
      transform: translate(-50%, 10%) scale(.5);
      transition: all .25s;
    }
  }

  svg {
    opacity: 0;
    color: $spot-color;
    font-size: 1.4em;
    transition: opacity .2s;
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

.hotspot-details {
  --top: 0;
  --left: 0;

  z-index: 5;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: clip-path;
  transform: translateZ(0);

  &.is-loaded {
    .hotspot-details__content {
      opacity: 1;
      transform: scale(1);
      transition: opacity .3s, transform .3s;
      backface-visibility: hidden;
    }

    .hotspot-details__nav-item {
      transform: translate(0, 0);
      transition: transform .3s;
      backface-visibility: hidden;

      @for $i from 2 through 3 {
        &:nth-child(#{$i}) {
          transition-delay: 75ms * $i;
        }
      }
    }
  }

  &__left,
  &__right {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(#00a9f1, 0.8);
    will-change: background;
  }

  &__left {
    clip-path: polygon(0 0, 52.1% 0, 47.1% 100%, 0% 100%);

    .hotspot-details__content {
      padding: 0;
    }
  }

  &__right {
    background: rgba(#fff, 0.8);
    clip-path: polygon(52% 0, 100% 0, 100% 100%, 47% 100%);

    .hotspot-details__content {
      position: relative;
      left: 50%;
      padding-left: 2.5em;
    }
  }

  &__content {
    opacity: 0;
    width: 50%;
    height: 100%;
    padding: 4em 2em 2em 2em;
    transform: scale(.9);
    transition: opacity .3s .3s, transform .3s .3s;

    img {
      width: 80%;
    }
  }

  &__title {
    margin-top: 0;
    font-weight: 300;
    font-size: 24px;
    @media (min-width: 768px) {
      font-size: 38px;
    }
  }

  &__description {
    margin-bottom: 32px;
    font-size: 14px;

    @media (min-width: 768px) {
      font-size: 16px;
    }
  }

  &__price {
    font-size: 38px;
    font-weight: 400;
    color: #00a9f1;
    text-shadow: 1px 1px white;
  }

  &__nav {
    position: absolute;
    bottom: 1em;
    left: 0;
    width: 47%;
    display: flex;
  }

  &__nav-item {
    width: 33%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    transform: translate(0, 120%);
    transition: transform .3s;

    @for $i from 2 through 3 {
      &:nth-child(#{$i}) {
        transition-delay: 75ms * $i;
      }
    }

    &:hover {
      img {
        transform: scale(1.2);
        opacity: 1;
      }
    }

    img {
      width: 35px;
      opacity: .8;
      transform: scale(1);
      transition: transform .2s, opacity .2s;
      backface-visibility: hidden;
    }
  }

  &__close {
    display: block;
    z-index: 2;
    position: absolute;
    top: 10px;
    right: 10px;
    color: black;
    font-size: 2em;
    line-height: 1;
    text-decoration: none;

    &:hover,
    &:active {
      color: #000;
      transition: transform .3s;
    }

    &:active {
      transform: scale(1.1);
    }
  }
}

.detail-enter-active {
  animation: detailsReveal .8s cubic-bezier(0.645, 0.045, 0.355, 1);

  .hotspot-details__left {
    background: rgba(#cf00f1, .8);
  }

  .hotspot-details__right {
    background: rgba(#cf00f1, .8);
  }
}

.detail-enter-to {
  .hotspot-details__left {
    background: rgba(#00a9f1, 0.8);
    transition: background .3s .2s;
  }

  .hotspot-details__right {
    background: rgba(#fff, 0.8);
    transition: background .3s .2s;
  }
}

.detail-leave-active {
  animation: detailsReveal .8s .5s cubic-bezier(0.645, 0.045, 0.355, 1) reverse;

  .hotspot-details__left {
    background: rgba(#cf00f1, .8);
    transition: background .3s .7s;
  }

  .hotspot-details__right {
    background: rgba(#cf00f1, .8);
    transition: background .3s .7s;
  }
}

.product-fade-enter-active {
  transition: all .25s ease;

  @for $i from 2 through 3 {
    &.animated:nth-child(#{$i}) {
      transition-delay: 50ms * $i;
    }
  }
}

.product-fade-leave-active {
  transition: all .25s ease;

  @for $i from 2 through 3 {
    &.animated:nth-child(#{$i}) {
      transition-delay: 50ms * $i;
    }
  }
}

.product-fade-enter, .product-fade-leave-to {
  transform: translate3d(0, 10px, 0);
  opacity: 0;
}


@keyframes detailsReveal {
  0% {
    clip-path: circle(.9em at calc(var(--left) + .9em) calc(var(--top) + .9em));
  }
  30% {
    clip-path: circle(5vw at 50% 50%);
  }
  100% {
    clip-path: circle(130% at 50% 50%);
  }
}


</style>
