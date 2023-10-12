// Copyright (C) 2023 Sabeel Mehmood
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
var vscode = require("vscode");
var parser = require("./lib/parser");
var template = require("./lib/templates");

function parse_entity() {
    
    var copied_msg;
    var active_pos;
    active_pos = vscode.window.activeTextEditor.selection.active;

    var init_pos = new vscode.Position(0,0);
    var start_rng = new vscode.Range(init_pos,init_pos);
    var end_rng = new vscode.Range(init_pos,init_pos);
    var entity_start_found = false;
    var entity_end_found = false;
    var entity_code_parsed = null;

    // Ensure the horizontal position is at start of the line for the line search below
    active_pos = active_pos.translate(0,-active_pos.character);

    // Starting from cursor position, loop back up the file until we find the entity start
    while (true) {
        start_rng = vscode.window.activeTextEditor.document.getWordRangeAtPosition(active_pos,/.*\bentity\s\b/i);
        if (start_rng != undefined) {
            entity_start_found = true;
            break;
        }
        if (active_pos.line > 0) {
            active_pos = active_pos.translate(-1,0);
        } else {
            break;
        }
    }

    // Starting from cursor position, loop forward/down the file until we find the entity end
    if (entity_start_found) {
        while (true) {
            end_rng = vscode.window.activeTextEditor.document.getWordRangeAtPosition(active_pos,/.*\bend\b(.*|\r|\n|\r\n).*;/i);
            
            if (end_rng != undefined) {
                entity_end_found = true;
                break;
            }
            if (active_pos.line <= vscode.window.activeTextEditor.document.lineCount) {
                active_pos = active_pos.translate(1,0);
            } else {
                break;
            }
        }                
    }

    // Create range object from start and end positions just found & call the parser to parse for ports, generics & name
    if (entity_start_found && entity_end_found) {
        var rng = new vscode.Range(start_rng.start,end_rng.end);
        var entity_text = vscode.window.activeTextEditor.document.getText(rng);
        entity_code_parsed = new parser.parser(entity_text);
    } else {
        vscode.window.showInformationMessage("Failed to find an entity");
    }
    return entity_code_parsed;
}

// Get user extension configurations
function getOptions() {
     return {"signalPrefix": vscode.workspace.getConfiguration('vhdl-entity-converter').signalPrefix,
             "constPrefix": vscode.workspace.getConfiguration('vhdl-entity-converter').constPrefix,
             "instancePrefix": vscode.workspace.getConfiguration('vhdl-entity-converter').instancePrefix,
             "indentType": vscode.workspace.getConfiguration('vhdl-entity-converter').indentType,
             "indentSpaceCount" : vscode.workspace.getConfiguration('vhdl-entity-converter').indentSpaceCount,
             "keywordCasing" : vscode.workspace.getConfiguration('vhdl-entity-converter').keywordCasing}
}

function copy_as_instance() {
    const entity = parse_entity();
    if (entity != null) {
        let entity_tmpl = new template.entity_cpy_tmpl(entity, getOptions());
        const text = entity_tmpl.instanceTemplate;
        vscode.env.clipboard.writeText(text);
        vscode.window.showInformationMessage(`Copied instance of ${entity.name}`);
    }
}

function copy_generics_as_constants() {
    const entity = parse_entity();
    if (entity != null) {
        let entity_tmpl = new template.entity_cpy_tmpl(entity, getOptions());
        const text = entity_tmpl.constantsTemplate;
        vscode.env.clipboard.writeText(text);
        vscode.window.showInformationMessage(`Copied generics of ${entity.name} as constants`);
    }
}

function copy_ports_as_signals() {
    const entity = parse_entity();
    if (entity != null) {
        let entity_tmpl = new template.entity_cpy_tmpl(entity, getOptions());
        const text = entity_tmpl.signalsTemplate;
        vscode.env.clipboard.writeText(text);
        vscode.window.showInformationMessage(`Copied signals of ${entity.name} as signals`);
    }
}

function copy_as_component() {
    const entity = parse_entity();
    if (entity != null) {
        let entity_tmpl = new template.entity_cpy_tmpl(entity, getOptions());
        const text = entity_tmpl.componentTemplate;
        vscode.env.clipboard.writeText(text);
        vscode.window.showInformationMessage(`Copied component of ${entity.name}`);
    }
}
// TODO: figure out searching for end of entity in the instance where it is commented out, e.g. "-- entity;" will be picked up to mean end of entity.
function activate(context) {

    let copy_comp_cmd = vscode.commands.registerCommand('vhdl-entity-converter.copy-as-component', function () {
        copy_as_component();
     })

    let copy_inst_cmd = vscode.commands.registerCommand('vhdl-entity-converter.copy-as-instance', function () {
       copy_as_instance();
    })

    let copy_sig_cmd = vscode.commands.registerCommand('vhdl-entity-converter.copy-ports-as-signals', function () {
       copy_ports_as_signals();
    })

    let copy_const_cmd = vscode.commands.registerCommand('vhdl-entity-converter.copy-generics-as-constants', function () {
        copy_generics_as_constants();
    })

    context.subscriptions.push(copy_comp_cmd);
    context.subscriptions.push(copy_inst_cmd);
    context.subscriptions.push(copy_sig_cmd);
    context.subscriptions.push(copy_const_cmd);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
