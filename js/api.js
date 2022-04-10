function getData() {

    let uf = document.querySelector("#uf").value
    let url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    let txt = []
    let tabela = document.querySelector("#showTabela")
    let radioSelected = document.querySelector('[name="tipo"]:checked').value

    const options = {
        method: "GET",
        mode: "cors",
        cache: 'default'
    }

    fetch(url, options)
        .then(response => {
            response.json()
                .then(data => showData(data))
        })
        .catch(e => console.log("Erro: " + e.message))

    const showData = (result) => {
        dadosJSON = result
        if (radioSelected == "tela") {
            createTableHeader()
            dadosJSON.forEach(function(arr, i) {
                setTableData(i)
            });
        } else if (radioSelected == "arquivo") {
            dadosJSON.forEach(function(arr, i) {
                setTableData(i)
                txt.push(`${dadosJSON[i]['id']} - ${dadosJSON[i]['nome']} - ${dadosJSON[i]['regiao-imediata']['regiao-intermediaria'].UF.nome} - ${dadosJSON[i]['regiao-imediata']['regiao-intermediaria'].UF.regiao.nome}`)
                txt.push("\n")
            });
            tabela.innerHTML = "";
            createFile(txt)
        }
    }

    function createTableHeader() {
        let tabTH = `<tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Estado</th>
                    <th>Região</th>
                </tr>`
        tabela.innerHTML = tabTH
    }

    function setTableData(i) {
        let linha = document.createElement("tr")
        let tdId = document.createElement("td")
        let tdCidade = document.createElement("td")
        let tdEstado = document.createElement("td")
        let tdRegiao = document.createElement("td")

        tdId.innerHTML = dadosJSON[i]['id']
        tdCidade.innerHTML = dadosJSON[i]['nome']
        tdEstado.innerHTML = dadosJSON[i]['regiao-imediata']['regiao-intermediaria'].UF.nome
        tdRegiao.innerHTML = dadosJSON[i]['regiao-imediata']['regiao-intermediaria'].UF.regiao.nome

        linha.appendChild(tdId)
        linha.appendChild(tdCidade)
        linha.appendChild(tdEstado)
        linha.appendChild(tdRegiao)

        tabela.appendChild(linha)
    }

    function createFile(txt) {
        const arquivo = new Blob([txt], { type: "octet-stream" })
        const href = URL.createObjectURL(arquivo)
        const a = Object.assign(document.createElement('a'), {
            href,
            style: "display:none",
            download: `cidades-${uf}.txt`,
        })
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(href)
        a.remove()
    }
}