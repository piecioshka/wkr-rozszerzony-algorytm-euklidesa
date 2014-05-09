/**
 * @author Piotr Kowalski <piecioshka@gmail.com>
 * @see http://jsninja.pl/wkr-rozszerzony-algorytm-euklidesa/
 * @licence The MIT License {@link http://piecioshka.mit-license.org/}
 */
(function (root, factory) {
    root.App = factory(root._);
}(this, function (_) {
    'use strict';

    function App(options) {
        this.settings = _.extend({}, options);
        this.initialize();
    }

    App.prototype = {
        initialize: function () {
            var s = this.settings;

            _.bindAll(this, '_enterHandler', '_submitHandler');

            // after click submit do calculation
            s.submit.on('click', this._submitHandler);

            // print result on any input have been modify
            s.first.on('keydown', this._enterHandler);
            s.second.on('keydown', this._enterHandler);

            // set focus on first input
            s.first.focus();
        },

        _enterHandler: function (e) {
            // if `enter`
            if (e.keyCode === 13) {
                if (this._checkParams()) {
                    this._printResult(this._calculate());
                }
            } else {
                this._clearResult();
            }
        },

        _submitHandler: function (e) {
            if (this._checkParams()) {
                this._printResult(this._calculate());
            }
            e.preventDefault();
        },

        _checkParams: function () {
            var s = this.settings;
            var n = s.first.val();
            var a = s.second.val();

            if (!n.length || !a.length) {
                alert('Please fill mandatory params');
                return false;
            }

            return true;
        },

        _calculate: function () {
            var s = this.settings;
            var n = s.first.val();
            var a = s.second.val();

            var data = [['ui', 'u\'i', 'vi', 'v\'i', 'ni', 'ai', 'qi', 'ri']];

            var i = 0;
            var ui = 0;
            var u$i = 1;
            var vi = 1;
            var v$i = 0;

            var ni = n;
            var ai = a;

            var qi = Math.floor(ni / ai);
            var ri = ni % ai;

            data.push([ui, u$i, vi, v$i, ni, ai, qi, ri]);

            while (ri > 0) {
                i++;

                ui = u$i - qi * ui;
                u$i = _.last(data)[0];

                vi = v$i - qi * vi;
                v$i = _.last(data)[2];

                ni = ai;
                ai = ri;

                qi = Math.floor(ni / ai);
                ri = ni % ai;

                data.push([ui, u$i, vi, v$i, ni, ai, qi, ri]);
            }

            return data;
        },

        _findGCD: function (list) {
            var gcd = -1;
            var index = 0;

            _.each(list, function (row, i) {
                if (_.last(row) === 0) {
                    gcd = _.last(list[(i - 1)]);
                    index = (i - 1);
                }
            });

            return {
                gcd: gcd,
                index: index
            };
        },

        _printResult: function (result) {
            var $table = $('<table>').addClass('table table-bordered table-condensed');
            var $thead = $('<thead>');
            var $tbody = $('<tbody>');

            var gcd = this._findGCD(result);

            // -- header

            var $tr = $('<tr>').addClass('info');
            _.each(result.shift(), function (cell) {
                var $th = $('<th>').text(cell);
                $tr.append($th);
            });
            $thead.append($tr);
            $table.append($thead);

            // --- body

            _.each(result, function (rows, rowIndex) {
                var $tr = $('<tr>').addClass('active');
                _.each(rows, function (cell, cellIndex) {
                    var $td = $('<td>').text(cell);
                    if (cellIndex >= 4) $td.addClass('warning');
                    if ((_.size(rows) - 1)=== cellIndex && rowIndex === gcd.index - 1) $td.addClass('danger');
                    $tr.append($td);
                });
                $tbody.append($tr);
            });

            $table.append($tbody);

            // show table
            this.settings.result.removeClass('hidden').html($table);
        },

        _clearResult: function () {
            this.settings.result.addClass('hidden');
        }
    };

    return App;
}));