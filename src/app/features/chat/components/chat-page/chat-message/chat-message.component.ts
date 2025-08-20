import { Component, inject, Input, SecurityContext } from '@angular/core';
import { Message } from '../../../models/message.model';
import { NgClass } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

import 'prismjs/components/prism-java.min.js';
import 'prismjs/components/prism-python.min.js';
import 'prismjs/components/prism-csharp.min.js';
import 'prismjs/components/prism-pascal.min.js';
import 'prismjs/components/prism-c.min.js';
import 'prismjs/components/prism-cpp.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-css.min.js';
import 'prismjs/components/prism-scss.min.js';
import 'prismjs/components/prism-json.min.js';
import 'prismjs/components/prism-yaml.min.js';
import 'prismjs/components/prism-latex.min.js';
import 'prismjs/components/prism-matlab.min.js';
import 'prismjs/components/prism-markup.min.js';
import 'prismjs/components/prism-markup-templating.min.js';
import 'prismjs/components/prism-dart.min.js';
import 'prismjs/components/prism-docker.min.js';
import 'prismjs/components/prism-xml-doc.min.js';
import 'prismjs/components/prism-graphql.js';
import 'prismjs/components/prism-php.min.js';
import 'prismjs/components/prism-rust.min.js';
import 'prismjs/components/prism-go.min.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-plsql.min.js';

@Component({
  selector: 'ollama-chat-chat-message',
  imports: [
    NgClass,
    MarkdownComponent
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  @Input({ required: true }) message!: Message;
}
