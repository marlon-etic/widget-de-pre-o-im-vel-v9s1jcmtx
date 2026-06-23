migrate(
  (app) => {
    const collection = new Collection({
      name: 'analises_imoveis',
      type: 'base',
      listRule: "@request.auth.id != '' && usuario_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && usuario_id = @request.auth.id",
      createRule: "@request.auth.id != '' && usuario_id = @request.auth.id",
      updateRule: "@request.auth.id != '' && usuario_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && usuario_id = @request.auth.id",
      fields: [
        {
          name: 'usuario_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'url_imovel', type: 'text' },
        { name: 'preco_imovel', type: 'number' },
        { name: 'area', type: 'number' },
        { name: 'quartos', type: 'number' },
        { name: 'suites', type: 'number' },
        { name: 'banheiros', type: 'number' },
        { name: 'vagas', type: 'number' },
        { name: 'tipo', type: 'number' },
        { name: 'bairro', type: 'text' },
        { name: 'cidade', type: 'text' },
        { name: 'estado', type: 'text' },
        { name: 'preco_inferido', type: 'number' },
        { name: 'faixa_minima', type: 'number' },
        { name: 'faixa_maxima', type: 'number' },
        { name: 'preco_medio', type: 'number' },
        { name: 'preco_unitario', type: 'number' },
        { name: 'liquidez', type: 'text' },
        { name: 'registros_usados', type: 'number' },
        { name: 'condominio_atual', type: 'number' },
        { name: 'condominio_media', type: 'number' },
        { name: 'iptu_atual', type: 'number' },
        { name: 'iptu_media', type: 'number' },
        { name: 'data_analise', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('analises_imoveis')
    app.delete(collection)
  },
)
