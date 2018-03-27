import * as _ from 'lodash';
import { Common } from '../../common';
import { Constants } from '../../constants';
import { MapDom } from '../map-dom';

export class CPIf {

    private element: any;
    private map: MapDom;
    private attribute;
    private elementComment;

    constructor(_element: HTMLElement, _map: MapDom) {
        Common.getScope(_element).$on('$onInit', () => {
            this.element = _element;
            this.element['cpIf'] = this;
            this.integrationCpElse();
            this.map = _map;
            this.attribute = Common.getAttributeCpIf(this.element);
            if (!this.attribute) {
                throw new Error(`syntax error ${Constants.IF_ATTRIBUTE_NAME} expected arguments`);
            }
            this.elementComment = document.createComment('cpIf ' + this.attribute);
            this.init();
        });
    }

    public integrationCpElse() {
        const nextElement = this.element.nextElementSibling;
        if (nextElement && (nextElement.hasAttribute(Constants.ELSE_ATTRIBUTE_NAME) || nextElement.hasAttribute(Constants.ELSE_IF_ATTRIBUTE_NAME)) ) {
            Common.getScope(nextElement).parentCondition = this;
        }
    }

    public init() {
        if (!this.element) {
            return;
        }
        try {
            Common.createElement(this.element, this.elementComment);
            if (!Common.isValidCondition(this.element, Common.getAttributeCpIf(this.element))) {
                Common.destroyElement(this.element, this.elementComment);
            }
        } catch (ex) {
            Common.destroyElement(this.element, this.elementComment);
        }
    }
}