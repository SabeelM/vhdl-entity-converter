"use babel"
// Copyright (C) 2016 Pete Burgers
//
//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <http://www.gnu.org/licenses/>.

const DEFAULT_OPTIONS = {signalPrefix: "", constPrefix: "", instancePrefix: "", indentType: "", indentSpaceCount: 0, keywordCasing: "lowercase"}

class entity_cpy_tmpl {
    constructor(entity, options = DEFAULT_OPTIONS) {
        this.entity = entity;
        this.signalPrefix = options.signalPrefix;
        this.constPrefix = options.constPrefix;
        this.instancePrefix = options.instancePrefix;
        this.indentType = options.indentType;
        this.indentSpaceCount = options.indentSpaceCount;
        this.keywordCasing = options.keywordCasing;
    }

    get componentTemplate() {
        let text = this.normaliseKeywordCasing("component ") + this.entity.name + `\n`;

        const indentString = this.getIndentString(this.indentType, this.indentSpaceCount)
        if (this.entity.generics.length > 0) {
            text += this.normaliseKeywordCasing("generic") + ` (\n`
            const longest = this.longestinArray(this.entity.generics, "name")
            for (let generic of this.entity.generics) {
                const name = this.rpad(generic.name, longest)
                text += `${indentString}${name} : ${generic.type}`
                if (generic.default) {
                    text += ` := ${generic.default}`
                }
                text += `;\n`
            }
            // Strip the final semicolon
            text = text.slice(0, -2)
            text += `\n);\n`
        }

        if (this.entity.ports.length > 0) {
            text += this.normaliseKeywordCasing("port") + ` (\n`
            const longest = this.longestinArray(this.entity.ports, "name")
            for (let port of this.entity.ports) {
            const name = this.rpad(port.name, longest)
            const dir = this.rpad(port.dir, 3)
            text += `${indentString}${name} : ` + this.normaliseKeywordCasing(dir) + ` ${port.type};\n`
            }
            // Strip the final semicolon
            text = text.slice(0, -2)
            text += `\n);\n`
        }

        text += this.normaliseKeywordCasing("end component ") + this.entity.name + `;\n`
        return text
    }

    get instanceTemplate() {
        let text = `${this.instancePrefix}${this.entity.name} : ${this.entity.name}`
        const indentString = this.getIndentString(this.indentType, this.indentSpaceCount)
        if (this.entity.generics.length > 0) {
            text += `\n` + this.normaliseKeywordCasing("generic map ") + `(\n`
            const longest = this.longestinArray(this.entity.generics, "name")
            for (let generic of this.entity.generics) {
            const name = this.rpad(generic.name, longest)
            text += `${indentString}${name} => ${generic.name},\n`
            }
            // Strip the final comma
            text = text.slice(0, -2)
            text += `\n)`
        }

        if (this.entity.ports.length > 0) {
            text += `\n` + this.normaliseKeywordCasing("port map") + ` (\n`
            const longest = this.longestinArray(this.entity.ports, "name")
            for (let port of this.entity.ports) {
                const name = this.rpad(port.name, longest)
                text += `${indentString}${name} => ${this.signalPrefix}${port.name},\n`
            }
            // Strip the final comma
            text = text.slice(0, -2)
            text += `\n)`
        }

        text += `;\n`
        return text
    }

    get constantsTemplate() {
        let text = ""
        if (this.entity.generics.length > 0) {
            const longest = this.longestinArray(this.entity.generics, "name")
            for (let generic of this.entity.generics) {
                const name = this.rpad(generic.name, longest)
                text += this.normaliseKeywordCasing("constant ") + `${this.constPrefix}${name} : ${generic.type} := ${generic.default};\n`
            }
        }
        return text
    }
    get signalsTemplate() {
        let text = ""
        if (this.entity.ports.length > 0) {
            const longest = this.longestinArray(this.entity.ports, "name")
            for (let port of this.entity.ports) {
                const name = this.rpad(port.name, longest)
                text += this.normaliseKeywordCasing("signal ") + `${this.signalPrefix}${name} : ${port.type};\n`
            }
        }
        return text
    }

    longestinArray(array, attr) {
        let longest = 0
        for (let object of array) {
            if (object[attr].length > longest) {
                longest = object.name.length
            }
        }
        return longest
    }

    rpad(string, length, padChar = " ") {
        while (string.length < length) {
            string = string + padChar
        }
        return string
    }

    getIndentString(type, count)
    {
        if (type == 'Tabs') {
            return '\t'
        } else if (type == 'Spaces') {
            return ' '.repeat(count)
        } else {
            return '  ' // default fallback
        }
    }

    normaliseKeywordCasing(input)
    {
        if (this.keywordCasing = "uppercase") {
            return input.toUpperCase();
        } else {
            return input.toLowerCase();
        }
    }
}
module.exports = {
  entity_cpy_tmpl
}
