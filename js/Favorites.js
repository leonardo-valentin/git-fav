import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username)

      if (userExists) {
        throw new Error("Usuário já existente!")
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!")
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || []
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    )
    this.entries = filteredEntries
    this.update()
    this.save()
  }

  save() {
    localStorage.setItem("@github-favorites", JSON.stringify(this.entries))
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector("table tbody")

    this.onadd()
    this.update()
  }

  onadd() {
    document.querySelector("header button").onclick = () => {
      const { value } = this.root.querySelector("header input")
      this.add(value)
      this.root.querySelector("header input").value = ""
    }
  }

  update() {
    if (this.entries == "") {
      document.querySelector(".no-content").classList.remove("notdisplayed")
      document.querySelector(".content").classList.add("notdisplayed")
      return
    }

    this.removeAllTr()

    document.querySelector(".no-content").classList.add("notdisplayed")
    document.querySelector(".content").classList.remove("notdisplayed")
    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`
      row.querySelector(".user img").alt = `imagem de ${user.name}`

      row.querySelector(".user a").href = `https://github.com/${user.login}`
      row.querySelector(".user p").textContent = user.name
      row.querySelector(".user span").textContent = user.login
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar o usuário?")

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }

  createRow() {
    const tr = document.createElement("tr")
    tr.innerHTML = `    
              <td class="user">
                <img
                  src="https://github.com/leonardo-valentin.png"
                  alt="imagem de leonardo valentin"
                />
                <a href="https://github.com/leonardo-valentin" target="_blank">
                  <p>Leonardo Valentin</p>
                  <span>/leonardo-valentin</span>
                </a>
              </td>
              <td class="repositories">43</td>
              <td class="followers">15</td>
              <td class="actions"><button class="remove">Remover</button></td>`
    return tr
  }
}
