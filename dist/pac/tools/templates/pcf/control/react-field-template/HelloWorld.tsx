import * as React from 'react';
import { Label } from '@fluentui/react';

export interface IHelloWorldProps {
  name?: string;
}

export class HelloWorld extends React.Component<IHelloWorldProps> {
  public render(): JSX.Element {
    return (
        <Label>
            "Hello, World!"
        </Label>
    )
  }
}
