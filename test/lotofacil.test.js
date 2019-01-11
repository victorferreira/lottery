const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const nock = require('nock')

const expect = chai.expect
chai.use(sinonChai)

const lotofacil = require('../src/cmd/lotofacil')
describe('Lotofacil', () => {
  let consoleStub

  const responseTemplate = `
  -------------------------------------------------
  Concurso: 1750 - 05/01/2019
  Sorteio realizado no Caminhão da Sorte em CAIBI, SC
  -------------------------------------------------
   \n 01 04 06 07 10 \n 12 13 16 17 18 \n 19 20 22 23 24

  15 acertos 🎉
  3 apostas ganhadoras, R$ 816.915,38

  14 acertos
  396 apostas ganhadoras, R$ 1.904,24

  13 acertos
  13646 apostas ganhadoras, R$ 20,00

  12 acertos
  179759 apostas ganhadoras, R$ 8,00

  11 acertos
  1039142 apostas ganhadoras, R$ 4,00

  -------------------------------------------------
  Proximo Sorteio 09/01/2019
  Estimativa de prêmio é R$ 2.000.000,00
  -------------------------------------------------
  `
  const responseTemplateAcumulado = `
  -------------------------------------------------
  Concurso: 1744 - 30/11/2018
  Sorteio realizado no Caminhão da Sorte em CAIBI, SC
  -------------------------------------------------
  \n  01 05 06 10 11 \n  12 13 15 17 18 \n  19 20 21 23 24

  ACUMULADO!!

  15 acertos
  Não houve ganhador

  14 acertos
  361 apostas ganhadoras, R$ 1.904,24

  13 acertos
  16504 apostas ganhadoras, R$ 20,00

  12 acertos
  220102 apostas ganhadoras, R$ 8,00

  11 acertos
  1267141 apostas ganhadoras, R$ 4,00

  -------------------------------------------------
  Proximo Sorteio 03/12/2018
  Estimativa de prêmio é R$ 4.500.000,00
  -------------------------------------------------
  `

  const responseMockAcumulado = {
    'nu_concurso': 1744,
    'qt_ganhador_faixa1': 0,
    'qt_ganhador_faixa2': 361,
    'qt_ganhador_faixa3': 16504,
    'qt_ganhador_faixa4': 220102,
    'qt_ganhador_faixa5': 1267141,
    'vr_rateio_faixa1': 816915.38,
    'vr_rateio_faixa2': 1904.24,
    'vr_rateio_faixa3': 20.00,
    'vr_rateio_faixa4': 8.00,
    'vr_rateio_faixa5': 4.00,
    'sorteioAcumulado': true,
    'vrEstimativa': '4.500.000,00',
    'resultadoOrdenado': '01-04-06-07-10-12-13-16-17-18-19-20-22-23-24',
    'dt_apuracaoStr': '30/11/2018',
    'dtProximoConcursoStr': '03/12/2018',
    'localSorteio': 'no Caminhão da Sorte',
    'no_cidade': 'CAIBI',
    'sg_uf': 'SC',
    'mensagens': [],
    'error': false
  }
  const responseMock = {
    'nu_concurso': 1750,
    'qt_ganhador_faixa1': 3,
    'qt_ganhador_faixa2': 396,
    'qt_ganhador_faixa3': 13646,
    'qt_ganhador_faixa4': 179759,
    'qt_ganhador_faixa5': 1039142,
    'vr_rateio_faixa1': 816915.38,
    'vr_rateio_faixa2': 1904.24,
    'vr_rateio_faixa3': 20.00,
    'vr_rateio_faixa4': 8.00,
    'vr_rateio_faixa5': 4.00,
    'sorteioAcumulado': false,
    'valor_acumulado': 4312684.25,
    'vrEstimativa': 2000000.00,
    'resultadoOrdenado': '01-04-06-07-10-12-13-16-17-18-19-20-22-23-24',
    'dt_apuracaoStr': '05/01/2019',
    'dtProximoConcursoStr': '09/01/2019',
    'localSorteio': 'no Caminhão da Sorte',
    'no_cidade': 'CAIBI',
    'sg_uf': 'SC',
    'mensagens': [],
    'error': false
  }

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'info')
  })
  afterEach(() => {
    consoleStub.restore()
  })
  it('should search last lottery', async () => {
    nock('http://loterias.caixa.gov.br')
      .get('/wps/portal/loterias/landing/lotofacil/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOLNDH0MPAzcDbz8vTxNDRy9_Y2NQ13CDA0sTIEKIoEKnN0dPUzMfQwMDEwsjAw8XZw8XMwtfQ0MPM2I02-AAzgaENIfrh-FqsQ9wBmoxN_FydLAGAgNTKEK8DkRrACPGwpyQyMMMj0VAcySpRM!/dl5/d5/L2dBISEvZ0FBIS9nQSEh/pw/Z7_61L0H0G0J0VSC0AC4GLFAD2003/res/id=buscaResultado/c=cacheLevelPage/=/')
      .reply(200, responseMock)

    await lotofacil({})
    expect(consoleStub).to.have.been.calledWith(responseTemplate)
  })
  it.only('should return the result of a specific search and have a winner', async () => {
    nock('http://loterias.caixa.gov.br')
      .get('/wps/portal/loterias/landing/lotofacil/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOLNDH0MPAzcDbz8vTxNDRy9_Y2NQ13CDA0sTIEKIoEKnN0dPUzMfQwMDEwsjAw8XZw8XMwtfQ0MPM2I02-AAzgaENIfrh-FqsQ9wBmoxN_FydLAGAgNTKEK8DkRrACPGwpyQyMMMj0VAcySpRM!/dl5/d5/L2dBISEvZ0FBIS9nQSEh/pw/Z7_61L0H0G0J0VSC0AC4GLFAD2003/res/id=buscaResultado/c=cacheLevelPage/=/')
      .query({ concurso: 1750 })
      .reply(200, responseMock)

    await lotofacil({ concurso: 1750 })
    expect(consoleStub).to.have.been.calledWith(responseTemplate)
  })
  it('should return the result of a specific search', async () => {
    nock('http://loterias.caixa.gov.br')
      .get('/wps/portal/loterias/landing/lotofacil/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOLNDH0MPAzcDbz8vTxNDRy9_Y2NQ13CDA0sTIEKIoEKnN0dPUzMfQwMDEwsjAw8XZw8XMwtfQ0MPM2I02-AAzgaENIfrh-FqsQ9wBmoxN_FydLAGAgNTKEK8DkRrACPGwpyQyMMMj0VAcySpRM!/dl5/d5/L2dBISEvZ0FBIS9nQSEh/pw/Z7_61L0H0G0J0VSC0AC4GLFAD2003/res/id=buscaResultado/c=cacheLevelPage/=/')
      .query({ concurso: 1744 })
      .reply(200, responseMockAcumulado)

    await lotofacil({ concurso: 1744 })
    expect(consoleStub).to.have.been.calledWith(responseTemplateAcumulado)
  })
})
