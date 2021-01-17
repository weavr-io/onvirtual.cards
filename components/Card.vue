<template>
  <div class="card-container">
    <div class="center">
      <div class="card" @click="showFront = !showFront">
        <div class="front" v-if="showFront">
          <div class="logo">
            <img src="/img/logo.svg" alt height="15px" />
          </div>
          <div class="card-number">
            <weavr-card-number-span
              class="card-select-number"
              :token="card.cardNumber"
              :base-style="{
                fontFamily: '\'Be Vietnam\', sans-serif',
                color: '#000',
                lineHeight: '1',
                fontSize: '20px'
              }"
            />
          </div>
          <div class="exp">
            <span class="end-text">VALID THRU:</span>
            <span class="end-date">{{ card.expiryMmyy | expiryMmyy }}</span>
          </div>
          <div class="card-holder">{{ card.nameOnCard }}</div>
        </div>
        <div class="back" v-if="!showFront">
          <div class="strip-black" />
          <div class="cvv">
            <label>CVV:</label>
            <weavr-cvv-span
              class="card-select-number"
              :token="card.cvv"
              :base-style="{
                fontFamily: '\'Be Vietnam\', sans-serif',
                color: '#000',
                lineHeight: '1',
                fontSize: '15px'
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

export interface ErrorLink {
  text: string
  link: string
}

@Component
export default class Card extends Vue {
  @Prop({ default: null }) readonly card!: string

  public showFront = true
}
</script>

<style lang="scss" scoped>
.card {
  border: none;
  cursor: pointer;

  .front,
  .back {
    width: 300px;
    height: 175px;
    background: #fafafa;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .front {
    padding: 20px;
    .card-number {
      margin-top: 55px;
    }
    .exp,
    .card-holder {
      font-size: 13px;
    }
  }

  .back {
    .strip-black {
      width: 100%;
      margin-top: 20px;
      background: #000;
      height: 40px;
    }
    .cvv {
      padding: 20px;
      margin-top: 30px;
    }
  }
}
</style>
