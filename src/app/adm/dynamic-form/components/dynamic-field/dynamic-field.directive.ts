import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormTitleComponent } from '../form-title/form-title.component';
import { FormCheckboxComponent } from '../form-checkbox/form-checkbox.component';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

const components = {
  input: FormInputComponent,
  title: FormTitleComponent,
  checkbox: FormCheckboxComponent
};
@Directive({
  selector: '[addDynamicFieldDirective]'
})
export class DynamicFieldDirective implements Field, OnInit{
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  component: ComponentRef<Field>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() {
    //if it is an unsupported type in response
    if (!components[this.config.input_type]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(
        `Trying to use an unsupported type (${this.config.input_type}).
        Supported types: ${supportedTypes}`
      );
    }
    const component = components[this.config.input_type];
    const factory = this.resolver.resolveComponentFactory<Field>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
  }
}
