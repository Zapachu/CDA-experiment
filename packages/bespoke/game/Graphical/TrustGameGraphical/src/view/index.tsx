import {registerOnFramework} from 'bespoke-client-util'
import {namespace} from '../config'
import {Create} from '../../../../Classic/TrustGame/src/view/Create'
import {CreateOnElf} from '../../../../Classic/TrustGame/src/view/CreateOnElf'
import {Result} from '../../../../Classic/TrustGame/src/view/Result'
import {Play} from './Play'

registerOnFramework(namespace, {
    icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTQ5MDg4Mjk2MTMyIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyOTIyIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxNy44MDMxNzgxOCA0OTAuMDc2ODc4MjlsMTQ0LjQzNDY5OTMzLTgzLjE3ODkxMDUxYzQuNTEzNTgxOC0yLjU3OTE5MjY4IDQuNTEzNTgxOC05LjAyNzE2ODk1IDAtMTEuNjA2MzYxNzJsLTE0My4xNDUxMDMwNC04Mi41MzQxMTI0MmMtMy44Njg3ODkwMy0yLjU3OTE5MjY4LTkuMDI3MTY4OTUtMi41NzkxOTI2OC0xMi44OTU5NTI2NSAwbC0xNDQuNDM0Njk5MzMgODMuMTc4OTEwNTFjLTQuNTEzNTgxOCAyLjU3OTE5MjY4LTQuNTEzNTgxOCA5LjAyNzE2ODk1IDAgMTEuNjA2MzU2NGwxNDMuMTQ1MTAzMDQgODIuNTM0MTE3NzRjMy44Njg3ODkwMyAyLjU3OTE5MjY4IDguMzgyMzcwODYgMi41NzkxOTI2OCAxMi44OTU5NTI2NSAwek0zMzAuMTY3MDMzNTQgNDQ4LjgwOTgyMjA0djE2Ny4wMDI2MTkyN2MwIDQuNTEzNTgxOCAyLjU3OTE5MjY4IDkuMDI3MTY4OTUgNi40NDc5NzYzNSAxMS42MDYzNTYzbDE0NC40MzQ2OTkyOSA4My4xNzg5MTA1NWM0LjUxMzU4MTggMi41NzkxOTI2OCA5LjY3MTk2NzIzLTAuNjQ0Nzk4MTcgOS42NzE5NjcxOC01LjgwMzE3ODE0di0xNjcuMDAyNjE5MThjMC00LjUxMzU4MTgtMi41NzkxOTI2OC05LjAyNzE2ODk1LTYuNDQ3OTgxNjQtMTEuNjA2MzYxNzNsLTE0NC40MzQ2OTM5OS04My4xNzg5MTA2MmMtMy44Njg3ODkwMy0yLjU3OTE5MjY4LTkuNjcxOTY3MjMgMC42NDQ3OTgxNy05LjY3MTk2NzE5IDUuODAzMTgzNTV6TTUzMi42MzM1MzA3NCA1MzYuNTAyMzE0NDZ2MTY3LjY0NzQxNzM1YzAgNS4xNTgzNzk5NyA1LjgwMzE3ODE4IDguMzgyMzcwODYgOS42NzE5NjE5IDUuODAzMTc4MjVsMTQ0LjQzNDY5OTIzLTgzLjE3ODkxMDQ5YzMuODY4Nzg5MDMtMi41NzkxOTI2OCA2LjQ0Nzk3NjM1LTYuNDQ3OTc2MzUgNi40NDc5NzYzNC0xMS42MDYzNTY0OXYtMTY3LjY0NzQxNzI5YzAtNS4xNTgzNzk5Ny01LjgwMzE3ODE4LTguMzgyMzcwODYtOS42NzE5NjcxOS01LjgwMzE4MzU2bC0xNDQuNDM0NjkzODkgODMuMTc4OTEwNDhjLTMuODY4Nzg5MDMgMi41NzkxOTI2OC02LjQ0Nzk3NjM1IDcuMDkyNzc0NDctNi40NDc5NzYzOSAxMS42MDYzNjE3NXoiIGZpbGw9IiMxMkI3RjUiIHAtaWQ9IjEyOTIzIj48L3BhdGg+PHBhdGggZD0iTTMzMi4xMDE0MjggMzc0LjY1ODA3NTIzbDE2Ny4wMDI2MTkyOS05Ni4wNzQ4NjMyNmM4LjM4MjM3MDg2LTQuNTEzNTgxOCAxOC4wNTQzMzgwOS00LjUxMzU4MTggMjYuNDM2NzAzNiAwbDE2NS43MTMwMjgyNCA5NS40MzAwNzA0OWM4LjM4MjM3MDg2IDQuNTEzNTgxOCAxOC4wNTQzMzgwOSA0LjUxMzU4MTggMjYuNDM2NzAzNSAwbDEzNC4xMTc5MzM5OC03Ny4zNzU3MzIzOGM0LjUxMzU4MTgtMi41NzkxOTI2OCA0LjUxMzU4MTgtOS4wMjcxNjg5NSAwLTExLjYwNjM2MTY3bC0zMjYuMjY3NjY1NzItMTg4LjI4MDk0MjljLTguMzgyMzcwODYtNC41MTM1ODE4LTE4LjA1NDMzODA5LTQuNTEzNTgxOC0yNi40MzY3MDM2IDBsLTMyNy41NTcyNjIwMyAxODguOTI1NzQwOTljLTQuNTEzNTgxOCAyLjU3OTE5MjY4LTQuNTEzNTgxOCA5LjAyNzE2ODk1IDAgMTEuNjA2MzYxNzNsMTM0LjExNzkzMzkgNzcuMzc1NzI3YzcuNzM3NTcyNyA0LjUxMzU4MTggMTguMDU0MzM4MDkgNC41MTM1ODE4IDI2LjQzNjcwODg0IDB6TTI4NC4zODYzOTAxNyA0MTAuMTIxOTUzMjZsLTEzNC4xMTc5MzM4NS03Ny4zNzU3MzIzOWMtNC41MTM1ODE4LTIuNTc5MTkyNjgtOS42NzE5NjcyMyAwLjY0NDc5ODE3LTkuNjcxOTY3MjcgNS44MDMxODM1OXYzNzkuNzg1ODc2MzhjMCA5LjY3MTk2NzIzIDUuMTU4Mzc5OTcgMTguMDU0MzM4MDkgMTIuODk1OTU4MTEgMjMuMjEyNzIzNDlsMzI4LjIwMjA2MDIgMTg5LjU3MDUzOTA4YzQuNTEzNTgxOCAyLjU3OTE5MjY4IDkuNjcxOTY3MjMtMC42NDQ3OTgxNyA5LjY3MTk2MTktNS44MDMxNzgxNHYtMTU0Ljc1MTQ2NDdjMC05LjY3MTk2NzIzLTUuMTU4Mzc5OTctMTguMDU0MzM4MDktMTIuODk1OTUyNjktMjMuMjEyNzE4MDNsLTE2Ny42NDc0MTczNy05Ni43MTk2NjY3MmMtOC4zODIzNzA4Ni00LjUxMzU4MTgtMTIuODk1OTUyNzEtMTMuNTQwNzUwODktMTIuODk1OTUyNzMtMjMuMjEyNzE4MjFWNDMzLjMzNDY3MTM4Yy0wLjY0NDc5ODE3LTEwLjMxNjc2NTM0LTUuODAzMTc4MTgtMTguNjk5MTM2MjgtMTMuNTQwNzU2My0yMy4yMTI3MTgxMnpNNzI2LjcxNzY1MTc3IDQzMS40MDAyODIxOFY2MjYuNzczOTk5NTdjMCA5LjY3MTk2NzIzLTUuMTU4Mzc5OTcgMTguMDU0MzM4MDktMTIuODk1OTUyNzIgMjMuMjEyNzE3OTdsLTE2Ny42NDc0MTc0MiA5Ni43MTk2NjY3NWMtOC4zODIzNzA4NiA0LjUxMzU4MTgtMTIuODk1OTUyNzEgMTMuNTQwNzUwODktMTIuODk1OTU3OTkgMjMuMjEyNzE4MTZ2MTU0Ljc1MTQ2NDYzYzAgNS4xNTgzNzk5NyA1LjgwMzE3ODE4IDguMzgyMzcwODYgOS42NzE5NjcxOCA1LjgwMzE3ODIzbDMyOC4yMDIwNjAyMi0xODkuNTcwNTM5MTFjOC4zODIzNzA4Ni00LjUxMzU4MTggMTIuODk1OTUyNzEtMTMuNTQwNzUwODkgMTIuODk1OTUyNjMtMjMuMjEyNzIzNTdWMzM2LjYxNTAwOTg5YzAtNS4xNTgzNzk5Ny01LjgwMzE3ODE4LTguMzgyMzcwODYtOS42NzE5NjE3OC01LjgwMzE3ODFsLTEzNC4xMTc5MzM5MyA3Ny4zNzU3MjY5Yy04LjM4MjM3MDg2IDUuMTU4Mzc5OTctMTMuNTQwNzUwODkgMTQuMTg1NTQ5MTEtMTMuNTQwNzU2MTkgMjMuMjEyNzIzNDl6IiBmaWxsPSIjMTJCN0Y1IiBwLWlkPSIxMjkyNCI+PC9wYXRoPjwvc3ZnPg==',
    localeNames: ['信任博弈 (动画版)', 'Trust Game (Graphical)'],
    Create,
    CreateOnElf,
    Play,
    Result
})
