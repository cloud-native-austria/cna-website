const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const docsDir = path.join(__dirname, '../src/pages');
const outputFile = path.join(__dirname, '../data/mdxFrontMatter.json');

const isEmpty = (obj) => Object.keys(obj).length === 0;

function findMdxFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(findMdxFiles(filePath));
        } else if (file.endsWith('.mdx')) {
            results.push(filePath);
        }
    });

    return results;
}

function validateFrontMatter(fm) {

    const date = new Date(fm.date);
    if (isNaN(date.getTime())) {
        throw new Error(`invalid date: ${fm.date}`);
    }
    // TODO: add additional checks
}

function preprocessMdx() {
    const mdxFiles = findMdxFiles(docsDir);

    let data = mdxFiles.map(filePath => {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const {data} = matter(fileContent);
        if (!isEmpty(data)) {
            validateFrontMatter(data);
        }
        const chapter = path.basename(path.dirname(filePath));
        return {
            file: filePath,
            chapter: chapter,
            frontMatter: data,
        };
    });

    data = data.filter(meetup => (!isEmpty(meetup.frontMatter)) && (new Date() < new Date(meetup.frontMatter.date)));

    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Preprocessed ${data.length} MDX files to ${outputFile}`);
}

preprocessMdx();
