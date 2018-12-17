import React, {Component} from 'react'

export default class EditorMenu extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className="editor-menu">
                <div className="interface__btn scale-btn" onClick={this.props.openScaleMenu}>
                    <div className="btn__icon icon-ruler"></div>
                    <div className="btn__text">Рабочая область</div>
                </div>
                <div className="interface__btn add-table" onClick={() => this.props.D.addTable()}>
                    <div className="btn__icon icon-table">
                        <div className="table-guest">2</div>
                    </div>
                    <div className="btn__text">2-местный</div>
                </div>
                <div className="interface__btn add-table" onClick={() => this.props.D.addTable({guests: 4})}>
                    <div className="btn__icon icon-table big">
                        <div className="table-guest">4</div>
                    </div>
                    <div className="btn__text">4-местный</div>
                </div>
                <div className="interface__btn add-table" onClick={() => this.props.D.addTable({guests: 6})}>
                    <div className="btn__icon icon-table big">
                        <div className="table-guest">6</div>
                    </div>
                    <div className="btn__text">6-местный</div>
                </div>
                <div className="interface__btn add-text" onClick={() => this.props.D.addText()}>
                    <div className="btn__icon icon-text">T</div>
                    <div className="btn__text">Текст</div>
                </div>
                <div className="interface__btn add-line" onClick={() => this.props.D.addLine()}>
                    <div className="btn__icon icon-line">
                        <div className="line grey"></div>
                    </div>
                    <div className="btn__text">Стена</div>
                </div>
                <div className="interface__btn add-window" onClick={() => this.props.D.addLine({type: 'glass'})}>
                    <div className="btn__icon icon-line">
                        <div className="line blue"></div>
                    </div>
                    <div className="btn__text">Стекло</div>
                </div>
                <div className="interface__btn add-bar" onClick={() => this.props.D.addLine({type: 'bar'})}>
                    <div className="btn__icon icon-line">
                        <div className="line brown"></div>
                    </div>
                    <div className="btn__text">Барная стойка</div>
                </div>
                <div className="interface__btn add-barnchair" onClick={() => this.props.D.addDecor({type: 'barnchair'})}>
                    <div className="btn__icon icon-barnchair"></div>
                    <div className="btn__text">Барный стул</div>
                </div>
                <div className="interface__btn add-decor" onClick={() => this.props.D.addDecor({type: 'decor'})}>
                    <div className="btn__icon icon-decor"></div>
                    <div className="btn__text">Декор</div>
                </div>
                <div className="interface__btn add-decor2" onClick={() => this.props.D.addDecor({type: 'decor2'})}>
                    <div className="btn__icon icon-decor2 big"></div>
                    <div className="btn__text">Мега-декор</div>
                </div>
                <div className="interface__btn export" onClick={() => this.props.D.exportData()}>
                    <div className="btn__icon icon-text">Ээ</div>
                    <div className="btn__text">Экспорт</div>
                </div>
                <div className="interface__btn clear">
                    <div className="btn__icon icon-text" onClick={() => this.props.D.clearAll()}>Оч</div>
                    <div className="btn__text">Очистить</div>
                </div>
            </div>
        )
    }
}
