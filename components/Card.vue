<template>
    <div class="card-container">
        <div class="center">
            <div class="card" @click="showFront = !showFront">
                <div v-if="showFront" class="front">
                    <LogoOvc :link="false" size="sm" />
                    <div class="card-number">
                        <weavr-card-number-span
                            :base-style="{
                                fontFamily: '\'Be Vietnam\', sans-serif',
                                color: '#000',
                                lineHeight: '1',
                                fontSize: '20px',
                            }"
                            :token="card.cardNumber"
                            class="card-select-number"
                        />
                    </div>
                    <div class="exp">
                        <span class="end-text">VALID THRU:</span>
                        <span class="end-date">{{ card.expiryMmyy | expiryMmyy }}</span>
                    </div>
                    <div class="card-holder">{{ card.nameOnCard }}</div>
                </div>
                <div v-if="!showFront" class="back">
                    <div class="strip-black" />
                    <div class="cvv">
                        <label>CVV:</label>
                        <weavr-cvv-span
                            :base-style="{
                                fontFamily: '\'Be Vietnam\', sans-serif',
                                color: '#000',
                                lineHeight: '1',
                                fontSize: '15px',
                            }"
                            :token="card.cvv"
                            class="card-select-number"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import LogoOvc from '~/components/atoms/LogoOvc.vue'

export interface ErrorLink {
    text: string
    link: string
}

@Component({
    components: { LogoOvc },
})
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
