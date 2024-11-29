import one from '../../assets/cssduel-refs/1.png'
import two from '../../assets/cssduel-refs/2.png'

export const duels = [
    {
        id: 1,
        title: "Simply Square",
        img: one,
        colors: ["#5d3a3a", "#b5e0ba"]
    },
    {
        id: 2,
        title: "Carrom",
        img: two,
        colors: ["#62374e", "#fdc57b"]
    }
]

export const starter = `<div></div>
<style>
  div {
    width: 100px;
    height: 100px;
    background: #dd6b4d;
  }
</style>

<!-- OBJECTIVE -->
<!-- Write HTML/CSS in this editor and replicate the given target image in the least code possible. What you write here, renders as it is -->

<!-- SCORING -->
<!-- The score is calculated based on the number of characters you use (this comment included :P) and how close you replicate the image. Read the FAQS (https://cssbattle.dev/faqs) for more info. -->

<!-- IMPORTANT: remove the comments before submitting -->`