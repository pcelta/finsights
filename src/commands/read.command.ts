import { Command, CommandRunner, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

interface ReadCommandOptions {
  file?: string;
  output?: 'text' | 'json';
}

@Injectable()
@Command({
  name: 'fin:read',
  description: 'Read and parse PDF files from the data directory',
})
export class ReadCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(
    _passedParams: string[],
    options?: ReadCommandOptions,
  ): Promise<void> {
    try {
      const fileName = options?.file || '2025-08-29-statement.pdf';
      const outputFormat = options?.output || 'text';

      const pdfPath = path.join(process.cwd(), 'src', 'data', fileName);

      if (!fs.existsSync(pdfPath)) {
        console.error(`Error: PDF file not found at ${pdfPath}`);
        return;
      }

      console.log(`Reading PDF: ${fileName}...`);
      console.log('');

      const dataBuffer = new Uint8Array(fs.readFileSync(pdfPath));
      const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
      const pdfDocument = await loadingTask.promise;

      const numPages = pdfDocument.numPages;
      const metadata = await pdfDocument.getMetadata();

      let fullText = '';

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      if (outputFormat === 'json') {
        const output = {
          fileName,
          filePath: pdfPath,
          pages: numPages,
          metadata: metadata.info,
          text: fullText,
        };
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log('=== PDF Information ===');
        console.log(`File: ${fileName}`);
        console.log(`Pages: ${numPages}`);
        console.log('');
        if (metadata.info) {
          console.log('=== Metadata ===');
          console.log(JSON.stringify(metadata.info, null, 2));
          console.log('');
        }
        console.log('=== Content ===');
        console.log(fullText);
      }
    } catch (error) {
      console.error('Error reading PDF:', error.message);
      if (error.stack) {
        console.error(error.stack);
      }
    }
  }

  @Option({
    flags: '-f, --file <filename>',
    description: 'PDF filename in src/data directory (default: 2025-08-29-statement.pdf)',
  })
  parseFile(val: string): string {
    return val;
  }

  @Option({
    flags: '-o, --output <format>',
    description: 'Output format: text or json (default: text)',
  })
  parseOutput(val: string): 'text' | 'json' {
    if (val !== 'text' && val !== 'json') {
      throw new Error('Output format must be either "text" or "json"');
    }
    return val;
  }
}
