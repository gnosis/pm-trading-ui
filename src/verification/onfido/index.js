import OnFidoWrapper from './components/OnFidoWrapper'

class OnFido {
  initialize(config) {
    this.DisplayComponent = OnFidoWrapper

    this.config = {
      ...config,
    }
  }
}

export default new OnFido()
