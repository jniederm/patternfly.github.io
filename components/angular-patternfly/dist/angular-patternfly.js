/**
 * @name  patternfly canvas
 *
 * @description
 *   Canvas module for patternfly.
 *
 */
angular.module('patternfly.canvas', ['dragging', 'ngDragDrop', 'ui.bootstrap']);
;/**
 * @name  patternfly card
 *
 * @description
 *   Card module for patternfly.
 *
 */
angular.module('patternfly.card', ['ui.bootstrap']);
;/**
 * @name  patternfly
 *
 * @description
 *   Charts module for patternfly. Must Include d3.js and c3.js to use
 *
 */
angular.module('patternfly.charts', ['patternfly.utils', 'ui.bootstrap', 'ngSanitize']);

;/**
 * @name  patternfly card
 *
 * @description
 *   Filters module for patternfly.
 *
 */
angular.module('patternfly.filters', ['ui.bootstrap']);
;/**
 * @name  patternfly.form
 *
 * @description
 *   Module for formting related functionality, primarily filters.
 */
angular.module('patternfly.form', []);
;/**
 * @name  patternfly
 *
 * @description
 *   Modal module for patternfly.
 *
 */
angular.module('patternfly.modals', ['ui.bootstrap.modal', 'ui.bootstrap.tpls']);
;/**
 * @name  patternfly navigation
 *
 * @description
 *   Navigation module for patternfly.
 *
 */
angular.module('patternfly.navigation', ['ui.bootstrap']);
;/**
 * @name  patternfly notification
 *
 * @description
 *   Notification module for patternfly.
 *
 */
angular.module('patternfly.notification', ['patternfly.utils', 'ui.bootstrap']);
;/**
 * @name  patternfly
 *
 * @description
 *   Base module for patternfly.
 */
angular.module('patternfly', [
  'patternfly.autofocus',
  'patternfly.card',
  'patternfly.filters',
  'patternfly.form',
  'patternfly.modals',
  'patternfly.navigation',
  'patternfly.notification',
  'patternfly.select',
  'patternfly.sort',
  'patternfly.toolbars',
  'patternfly.utils',
  'patternfly.validation',
  'patternfly.views',
  'patternfly.wizard'
]);

;/**
 * @name  patternfly card
 *
 * @description
 *   Select module for patternfly.
 *
 */
angular.module('patternfly.select', ['ui.bootstrap']);
;/**
 * @name  patternfly card
 *
 * @description
 *   Sort module for patternfly.
 *
 */
angular.module('patternfly.sort', ['ui.bootstrap']);
;/**
 * @name  patternfly
 *
 * @description
 *   Table module for patternfly.
 *
 */
angular.module('patternfly.table', ['datatables', 'patternfly.utils', 'patternfly.filters', 'patternfly.sort']);
;/**
 * @name  patternfly toolbars
 *
 * @description
 *   Filters module for patternfly.
 *
 */
angular.module('patternfly.toolbars', [
  'patternfly.utils',
  'patternfly.filters',
  'patternfly.sort',
  'patternfly.views']);
;
angular.module( 'patternfly.utils', ['ui.bootstrap'] );
;/**
 * @name  patternfly
 *
 * @description
 *   Views module for patternfly.
 *
 */
angular.module('patternfly.views', ['patternfly.utils', 'patternfly.filters', 'patternfly.sort', 'patternfly.charts', 'dndLists']);
;/**
 * @name  PatternFly Wizard
 *
 * @description
 *   Wizard module.
 *
 */
angular.module('patternfly.wizard', ['ui.bootstrap.modal',
  'ui.bootstrap.tpls',
  'patternfly.form']);


;/**
 * @ngdoc directive
 * @name patternfly.autofocus:pfFocused
 * @restrict A
 * @element ANY
 * @param {expression=} pfFocused If the expression is true, the element is focused and selected (if possible).
 *
 * @description
 * The focus on element is evaluated from given expression. If the expression provided as an attribute to this directive
 * is evaluated as true, the element is selected (and focused).
 *
 * @example
 <example module="patternfly.autofocus">

 <file name="index.html">
   <div>
   <form class="form-horizontal">

     <div class="form-group">
       <label class="col-sm-2 control-label" for="i1">Focus next input:</label>
       <div class="col-sm-10">
         <input id="i1" ng-model="isFocus" type="checkbox"></input>
       </div>
     </div>

     <div class="form-group">
       <label class="col-sm-2 control-label" for="i2">Focused input:</label>
       <div class="col-sm-10">
         <input class="form-control" id="i1" ng-model="i2" pf-focused="isFocus" placeholder="This will be selected after checking the box above."></input>
       </div>
     </div>

   </form>
   </div>
 </file>

 </example>
 */

angular.module('patternfly.autofocus', []).directive('pfFocused', ["$timeout", function ($timeout) {
  'use strict';

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(attrs.pfFocused, function (newValue) {
        $timeout(function () {
          if (newValue) {
            element[0].focus();
            if (element[0].select) {
              element[0].select();
            }
          }
        });
      });
    }
  };
}]);
;(function () {
  'use strict';

  angular.module('patternfly.canvas').component('pfCanvasEditor', {

    bindings: {
      chartDataModel: "=",
      chartViewModel: "=?",
      toolboxTabs: "=",
      readOnly: '<?'
    },
    transclude: true,
    templateUrl: "canvas-view/canvas-editor/canvas-editor.html",
    controller: ["$timeout", function ($timeout) {
      var ctrl = this;
      var newNodeCount = 0;
      var prevClickedOnChart, prevInConnectingMode;

      ctrl.$onInit = function () {
        ctrl.toolboxVisible = false;
        ctrl.hideConnectors = false;
        ctrl.draggedItem = null;
      };

      // need to get these in next digest cycle, after pfCanvas sets chartViewModel
      $timeout(function () {
        prevClickedOnChart = ctrl.chartViewModel.clickedOnChart;
        prevInConnectingMode = ctrl.chartViewModel.inConnectingMode;
      });

      ctrl.$doCheck = function () {
        if (angular.isDefined(prevClickedOnChart) && angular.isDefined(prevInConnectingMode)) {
          if (!angular.equals(ctrl.chartViewModel.clickedOnChart, prevClickedOnChart)) {
            if (ctrl.chartViewModel.clickedOnChart) {
              ctrl.chartViewModel.clickedOnChart = false;
              ctrl.hideToolbox();
            }
            prevClickedOnChart = ctrl.chartViewModel.clickedOnChart;
          }
          if (!angular.equals(ctrl.chartViewModel.inConnectingMode, prevInConnectingMode)) {
            if (ctrl.chartViewModel.inConnectingMode) {
              ctrl.hideConnectors = false;
              ctrl.hideToolbox();
            }
            prevInConnectingMode = ctrl.chartViewModel.inConnectingMode;
          }
        }
      };

      ctrl.addNodeToCanvas = function (newNode) {
        ctrl.chartViewModel.addNode(newNode);
      };

      /*** Toolbox Methods ***/

      ctrl.showToolbox = function () {
        ctrl.toolboxVisible = true;
        // add class to subtabs to apply PF style and
        // focus to filter input box

        $timeout(function () {
          angular.element(".subtabs>ul").addClass('nav-tabs-pf');
          angular.element("#filterFld").focus();
        });
      };

      ctrl.hideToolbox = function () {
        ctrl.toolboxVisible = false;
      };

      ctrl.toggleToolbox = function () {
        if (!ctrl.readOnly && !ctrl.chartViewModel.inConnectingMode) {
          if (ctrl.toolboxVisible === true) {
            ctrl.hideToolbox();
          } else {
            ctrl.showToolbox();
          }
        }
      };

      ctrl.tabClicked = function () {
        angular.element("#filterFld").focus();
      };

      /*** Toolbox ***/

      ctrl.startCallback = function (event, ui, item) {
        ctrl.draggedItem = item;
      };

      ctrl.dropCallback = function (event, ui) {
        var newNode = angular.copy(ctrl.draggedItem);
        newNodeCount++;
        newNode.x = event.clientX - 600;
        newNode.y = event.clientY - 200;
        newNode.backgroundColor = newNode.backgroundColor ? newNode.backgroundColor : '#fff';

        ctrl.chartViewModel.addNode(newNode);
      };

      ctrl.addNodeByClick = function (item) {
        var newNode = angular.copy(item);
        newNodeCount++;
        newNode.x = 250 + (newNodeCount * 4 + 160);
        newNode.y = 200 + (newNodeCount * 4 + 160);
        newNode.backgroundColor = newNode.backgroundColor ? newNode.backgroundColor : '#fff';

        ctrl.chartViewModel.addNode(newNode);
      };

      ctrl.tabClicked = function () {
        angular.element("#filterFld").focus();
      };

      ctrl.activeTab = function () {
        return ctrl.toolboxTabs.filter(function (tab) {
          return tab.active;
        })[0];
      };

      ctrl.activeSubTab = function () {
        var activeTab = ctrl.activeTab();
        if (activeTab && activeTab.subtabs) {
          return activeTab.subtabs.filter(function (subtab) {
            return subtab.active;
          })[0];
        }
      };

      ctrl.activeSubSubTab = function () {
        var activeSubTab = ctrl.activeSubTab();
        if (activeSubTab && activeSubTab.subtabs) {
          return activeSubTab.subtabs.filter(function (subsubtab) {
            return subsubtab.active;
          })[0];
        }
      };

      /*** Zoom ***/

      ctrl.maxZoom = function () {
        if (ctrl.chartViewModel && ctrl.chartViewModel.zoom) {
          return ctrl.chartViewModel.zoom.isMax();
        }

        return false;
      };

      ctrl.minZoom = function () {
        if (ctrl.chartViewModel && ctrl.chartViewModel.zoom) {
          return ctrl.chartViewModel.zoom.isMin();
        }

        return false;
      };

      ctrl.zoomIn = function () {
        ctrl.chartViewModel.zoom.in();
      };

      ctrl.zoomOut = function () {
        ctrl.chartViewModel.zoom.out();
      };
    }] // controller
  }); // module
})();
;/* eslint-disable */
(function() {
  'use strict';

  angular.module('patternfly.canvas')
    .directive('toolboxItems', toolboxItemsDirective);

  function toolboxItemsDirective() {
    var directive = {
      restrict: 'E',
      scope: {
        items: '=',
        startDragCallback: '=',
        clickCallback: '=',
        searchText: '='
      },
      controller: toolboxItemsController,
      templateUrl: 'canvas-view/canvas-editor/toolbox-items.html',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function toolboxItemsController() {
      var vm = this;

      vm.clickCallbackfmDir = function(item) {
        if (!item.disableInToolbox) {
          vm.clickCallback(item);
        }
      };

      vm.startDragCallbackfmDir = function(event, ui, item) {
        vm.startDragCallback(event, ui, item);
      };
    }
  }
})();
;(function () {
  'use strict';

  angular.module('patternfly.canvas')
  .filter('trustAsResourceUrl', ['$sce', function ($sce) {
    return function (val) {
      return $sce.trustAsResourceUrl(val);
    };
  }])

  //
  // Directive that generates the rendered chart from the data model.
  //
  .directive('pfCanvas', ["$document", function ($document) {
    return {
      restrict: 'E',
      templateUrl: "canvas-view/canvas/canvas.html",
      replace: true,
      scope: {
        chartDataModel: "=",
        chartViewModel: "=?",
        readOnly: "=?",
        hideConnectors: "=?"
      },
      controller: 'CanvasController',
      link: link
    };
    function link (scope) {
      var deleteKeyCode = 46;
      var ctrlKeyCode = 17;
      var ctrlDown = false;
      var aKeyCode = 65;
      var dKeyCode = 68;
      var escKeyCode = 27;

      $document.find('body').keydown(function (evt) {
        if (evt.keyCode === ctrlKeyCode) {
          ctrlDown = true;
          evt.stopPropagation();
          evt.preventDefault();
        }

        if (evt.keyCode === aKeyCode && ctrlDown) {
          //
          // Ctrl + A
          //
          scope.selectAll();
          scope.$digest();
          evt.stopPropagation();
          evt.preventDefault();
        }
      });

      $document.find('body').keyup(function (evt) {
        if (evt.keyCode === deleteKeyCode) {
          scope.deleteSelected();
          scope.$digest();
        }

        if (evt.keyCode === escKeyCode) {
          scope.deselectAll();
          scope.$digest();
        }

        if (evt.keyCode === ctrlKeyCode) {
          ctrlDown = false;
          evt.stopPropagation();
          evt.preventDefault();
        }
      });
    }
  }])
  //
  // Controller for the canvas directive.
  // Having a separate controller is better for unit testing, otherwise
  // it is painful to unit test a directive without instantiating the DOM
  // (which is possible, just not ideal).
  //
  .controller('CanvasController', ['$scope', 'dragging', '$element', '$document', function CanvasController ($scope, dragging, $element, $document) {
    var controller = this;

    $scope.chart = new pfCanvas.ChartViewModel($scope.chartDataModel);
    $scope.chartViewModel = $scope.chart;
    //
    // Reference to the document and jQuery, can be overridden for testting.
    //
    this.document = document;

    //
    // Wrap jQuery so it can easily be  mocked for testing.
    //
    this.jQuery = function (element) {
      return angular.element(element);
    };

    //
    // Init data-model variables.
    //
    $scope.draggingConnection = false;
    $scope.connectorSize = 6;
    $scope.dragSelecting = false;

    //
    // Reference to the connection, connector or node that the mouse is currently over.
    //
    $scope.mouseOverConnector = null;
    $scope.mouseOverConnection = null;
    $scope.mouseOverNode = null;

    //
    // The class for connections and connectors.
    //
    this.connectionClass = 'connection';
    this.connectorClass = 'connector';
    this.nodeClass = 'node';

    //
    // Translate the coordinates so they are relative to the svg element.
    //
    this.translateCoordinates = function (x, y, evt) {
      var svgElem =  $element.get(0);
      var matrix = svgElem.getScreenCTM();
      var point = svgElem.createSVGPoint();
      point.x = (x - evt.view.pageXOffset) / $scope.zoomLevel();
      point.y = (y - evt.view.pageYOffset) / $scope.zoomLevel();

      return point.matrixTransform(matrix.inverse());
    };

    $scope.hideConnectors = $scope.hideConnectors ? $scope.hideConnectors : false;

    $scope.isConnectorConnected = function (connector) {
      return (connector && connector.connected());
    };

    $scope.isConnectorUnconnectedAndValid = function (connector) {
      return (connector && !connector.connected() && !connector.invalid() &&
              connector.parentNode() !== $scope.connectingModeSourceNode);
    };

    // determins if a dest. connector is connected to the source node
    $scope.isConnectedTo = function (connector, node) {
      var i,connection;
      var connections = $scope.chart.connections;
      for (i = 0; i < connections.length; i++) {
        connection = connections[i];
        if (connection.dest === connector && connection.source.parentNode() === node) {
          return true;
        }
      }

      return false;
    };

    $scope.availableConnections = function () {
      return $scope.chart.validConnections;
    };

    $scope.foreignObjectSupported = function () {
      return $document[0].implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Extensibility', '1.1');
    };

    $scope.addNodeToCanvas = function (newNode) {
      $scope.chart.addNode(newNode);
    };

    $scope.$on('selectAll', function (evt, args) {
      $scope.selectAll();
    });

    $scope.selectAll = function () {
      $scope.chart.selectAll();
    };

    $scope.$on('deselectAll', function (evt, args) {
      $scope.deselectAll();
    });

    $scope.deselectAll = function () {
      $scope.chart.deselectAll();
    };

    $scope.$on('deleteSelected', function (evt, args) {
      $scope.deleteSelected();
    });

    $scope.deleteSelected = function () {
      $scope.chart.deleteSelected();
    };

    //
    // Called on mouse down in the chart.
    //
    $scope.mouseDown = function (evt) {
      if ($scope.readOnly) {
        return;
      }

      if ($scope.chart.inConnectingMode ) {
        // camceling out of connection mode, remove unused output connector
        $scope.cancelConnectingMode();
      }

      $scope.chart.deselectAll();

      $scope.chart.clickedOnChart = true;

      dragging.startDrag(evt, {

        //
        // Commence dragging... setup variables to display the drag selection rect.
        //
        dragStarted: function (x, y) {
          var startPoint;
          $scope.dragSelecting = true;
          startPoint = controller.translateCoordinates(x, y, evt);
          $scope.dragSelectionStartPoint = startPoint;
          $scope.dragSelectionRect = {
            x: startPoint.x,
            y: startPoint.y,
            width: 0,
            height: 0,
          };
        },

        //
        // Update the drag selection rect while dragging continues.
        //
        dragging: function (x, y) {
          var startPoint = $scope.dragSelectionStartPoint;
          var curPoint = controller.translateCoordinates(x, y, evt);

          $scope.dragSelectionRect = {
            x: curPoint.x > startPoint.x ? startPoint.x : curPoint.x,
            y: curPoint.y > startPoint.y ? startPoint.y : curPoint.y,
            width: curPoint.x > startPoint.x ? curPoint.x - startPoint.x : startPoint.x - curPoint.x,
            height: curPoint.y > startPoint.y ? curPoint.y - startPoint.y : startPoint.y - curPoint.y,
          };
        },

        //
        // Dragging has ended... select all that are within the drag selection rect.
        //
        dragEnded: function () {
          $scope.dragSelecting = false;
          $scope.chart.applySelectionRect($scope.dragSelectionRect);
          delete $scope.dragSelectionStartPoint;
          delete $scope.dragSelectionRect;
        },
      });
    };

    //
    // Handle nodeMouseOver on an node.
    //
    $scope.nodeMouseOver = function (evt, node) {
      if (!$scope.readOnly) {
        $scope.mouseOverNode = node;
      }
    };

    //
    // Handle nodeMouseLeave on an node.
    //
    $scope.nodeMouseLeave = function (evt, node) {
      $scope.mouseOverNode = null;
    };

    //
    // Handle mousedown on a node.
    //
    $scope.nodeMouseDown = function (evt, node) {
      var chart = $scope.chart;
      var lastMouseCoords;

      if ($scope.readOnly) {
        return;
      }

      dragging.startDrag(evt, {

        //
        // Node dragging has commenced.
        //
        dragStarted: function (x, y) {
          lastMouseCoords = controller.translateCoordinates(x, y, evt);

          //
          // If nothing is selected when dragging starts,
          // at least select the node we are dragging.
          //
          if (!node.selected()) {
            chart.deselectAll();
            node.select();
          }
        },

        //
        // Dragging selected nodes... update their x,y coordinates.
        //
        dragging: function (x, y) {
          var curCoords = controller.translateCoordinates(x, y, evt);
          var deltaX = curCoords.x - lastMouseCoords.x;
          var deltaY = curCoords.y - lastMouseCoords.y;

          chart.updateSelectedNodesLocation(deltaX, deltaY);

          lastMouseCoords = curCoords;
        },

        //
        // The node wasn't dragged... it was clicked.
        //
        clicked: function () {
          chart.handleNodeClicked(node, evt.ctrlKey);
        },

      });
    };

    //
    // Listen for node action
    //
    $scope.$on('nodeActionClicked', function (evt, args) {
      var action = args.action;
      var node = args.node;

      if (action === 'nodeActionConnect') {
        $scope.startConnectingMode(node);
      }
    });

    $scope.$on('nodeActionClosed', function () {
      $scope.mouseOverNode = null;
    });

    $scope.connectingModeOutputConnector = null;
    $scope.connectingModeSourceNode = null;

    $scope.startConnectingMode = function (node) {
      $scope.chart.inConnectingMode = true;
      $scope.hideConnectors = false;
      $scope.connectingModeSourceNode = node;
      $scope.connectingModeSourceNode.select();
      $scope.connectingModeOutputConnector = node.getOutputConnector();
      $scope.chart.updateValidNodesAndConnectors($scope.connectingModeSourceNode);
    };

    $scope.cancelConnectingMode = function () {
      // if output connector not connected to something, remove it
      if (!$scope.connectingModeOutputConnector.connected()) {
        $scope.chart.removeOutputConnector($scope.connectingModeOutputConnector);
      }
      $scope.stopConnectingMode();
    };

    $scope.stopConnectingMode = function () {
      $scope.chart.inConnectingMode = false;
      $scope.chart.resetValidNodesAndConnectors();
    };

    //
    // Handle connectionMouseOver on an connection.
    //
    $scope.connectionMouseOver = function (evt, connection) {
      if (!$scope.draggingConnection && !$scope.readOnly) {  // Only allow 'connection mouse over' when not dragging out a connection.
        $scope.mouseOverConnection = connection;
      }
    };

    //
    // Handle connectionMouseLeave on an connection.
    //
    $scope.connectionMouseLeave = function (evt, connection) {
      $scope.mouseOverConnection = null;
    };

    //
    // Handle mousedown on a connection.
    //
    $scope.connectionMouseDown = function (evt, connection) {
      var chart = $scope.chart;
      if (!$scope.readOnly) {
        chart.handleConnectionMouseDown(connection, evt.ctrlKey);
      }
      // Don't let the chart handle the mouse down.
      evt.stopPropagation();
      evt.preventDefault();
    };

    //
    // Handle connectorMouseOver on an connector.
    //
    $scope.connectorMouseOver = function (evt, node, connector, connectorIndex, isInputConnector) {
      if (!$scope.readOnly) {
        $scope.mouseOverConnector = connector;
      }
    };

    //
    // Handle connectorMouseLeave on an connector.
    //
    $scope.connectorMouseLeave = function (evt, node, connector, connectorIndex, isInputConnector) {
      $scope.mouseOverConnector = null;
    };

    //
    // Handle mousedown on an input connector.
    //
    $scope.connectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector) {
      if ($scope.chart.inConnectingMode && node !== $scope.connectingModeSourceNode) {
        $scope.chart.createNewConnection($scope.connectingModeOutputConnector, $scope.mouseOverConnector);
        $scope.stopConnectingMode();
      }
    };

    //
    // zoom.
    //
    $scope.$on('zoomIn', function (evt, args) {
      $scope.chart.zoom.in();
    });

    $scope.$on('zoomOut', function (evt, args) {
      $scope.chart.zoom.out();
    });

    $scope.maxZoom = function () {
      return ($scope.chart.chartViewModel && $scope.chart.chartViewModel.zoom) ? $scope.chart.chartViewModel.zoom.isMax() : false;
    };
    $scope.minZoom = function () {
      return ($scope.chart.chartViewModel && $scope.chart.chartViewModel.zoom) ? $scope.chart.chartViewModel.zoom.isMin() : false;
    };

    $scope.zoomLevel = function () {
      return $scope.chart.zoom.getLevel();
    };
  }
  ]);
})();
;/* eslint-disable */
//
// Global accessor.
//
var pfCanvas = {};

// Module.
(function() {
  //
  // Height of flow chart.
  //
  pfCanvas.defaultHeight = 756;

  //
  // Width of flow chart.
  //
  pfCanvas.defaultWidth = 1396;

  pfCanvas.defaultBgImageSize = 24;

  //
  // Width of a node.
  //
  pfCanvas.defaultNodeWidth = 150;

  //
  // Height of a node.
  //
  pfCanvas.defaultNodeHeight = 150;

  //
  // Amount of space reserved for displaying the node's name.
  //
  pfCanvas.nodeNameHeight = 40;

  //
  // Height of a connector in a node.
  //
  pfCanvas.connectorHeight = 25;

  //
  // Compute the Y coordinate of a connector, given its index.
  //
  pfCanvas.computeConnectorY = function(connectorIndex) {
    return pfCanvas.defaultNodeHeight / 2 + connectorIndex * pfCanvas.connectorHeight;
  };

  //
  // Compute the position of a connector in the graph.
  //
  pfCanvas.computeConnectorPos = function(node, connectorIndex, inputConnector) {
    return {
      x: node.x() + (inputConnector ? 0 : node.width ? node.width() : pfCanvas.defaultNodeWidth),
      y: node.y() + pfCanvas.computeConnectorY(connectorIndex),
    };
  };

  //
  // View model for a connector.
  //
  pfCanvas.ConnectorViewModel = function(connectorDataModel, x, y, parentNode) {
    this.data = connectorDataModel;

    this._parentNode = parentNode;
    this._x = x;
    this._y = y;

    //
    // The name of the connector.
    //
    this.name = function() {
      return this.data.name;
    };

    //
    // X coordinate of the connector.
    //
    this.x = function() {
      return this._x;
    };

    //
    // Y coordinate of the connector.
    //
    this.y = function() {
      return this._y;
    };

    //
    // The parent node that the connector is attached to.
    //
    this.parentNode = function() {
      return this._parentNode;
    };

    //
    // Is this connector connected?
    //
    this.connected = function() {
      return this.data.connected;
    };

    //
    // set connector connected
    //
    this.setConnected = function(value) {
      this.data.connected = value;
    };

    //
    // Is this connector invalid for a connecton?
    //
    this.invalid = function() {
      return this.data.invalid;
    };

    //
    // set connector invalid
    //
    this.setInvalid = function(value) {
      this.data.invalid = value;
    };

    //
    // Font Family for the the node.
    //
    this.fontFamily = function() {
      return this.data.fontFamily || "";
    };

    //
    // Font Content for the the node.
    //
    this.fontContent = function() {
      return this.data.fontContent || "";
    };
  };

  //
  // Create view model for a list of data models.
  //
  var createConnectorsViewModel = function(connectorDataModels, x, parentNode) {
    var viewModels = [];

    if (connectorDataModels) {
      for (var i = 0; i < connectorDataModels.length; ++i) {
        var connectorViewModel = new pfCanvas.ConnectorViewModel(connectorDataModels[i], x, pfCanvas.computeConnectorY(i), parentNode);
        viewModels.push(connectorViewModel);
      }
    }

    return viewModels;
  };

  //
  // View model for a node.
  //
  pfCanvas.NodeViewModel = function(nodeDataModel) {
    this.data = nodeDataModel;

    // set the default width value of the node
    if (!this.data.width || this.data.width < 0) {
      this.data.width = pfCanvas.defaultNodeWidth;
    }
    this.inputConnectors = createConnectorsViewModel(this.data.inputConnectors, 0, this);
    this.outputConnectors = createConnectorsViewModel(this.data.outputConnectors, this.data.width, this);

    // Set to true when the node is selected.
    this._selected = false;

    //
    // Name of the node.
    //
    this.name = function() {
      return this.data.name || "";
    };

    //
    // id of the node.
    //
    this.id = function() {
      return this.data.id || -1;
    };

    //
    // Image for the the node.
    //
    this.image = function() {
      return this.data.image || "";
    };

    //
    // Icon for the the node.
    //
    this.icon = function() {
      return this.data.icon || "";
    };

    //
    // Is node a bundle
    //
    this.bundle = function() {
      return this.data.bundle || "";
    };

    //
    // background color for the node.
    //
    this.backgroundColor = function() {
      return this.data.backgroundColor;
    };

    //
    // X coordinate of the node.
    //
    this.x = function() {
      return this.data.x;
    };

    //
    // Y coordinate of the node.
    //
    this.y = function() {
      return this.data.y;
    };

    //
    // Width of the node.
    //
    this.width = function() {
      return this.data.width;
    };

    //
    // Font Family for the the node.
    //
    this.fontFamily = function() {
      return this.data.fontFamily || "";
    };

    //
    // Font size for the the icon
    //
    this.fontSize = function() {
      return this.data.fontSize || "";
    };

    //
    // Font Content for the the node.
    //
    this.fontContent = function() {
      return this.data.fontContent || "";
    };

    //
    // Returns valid connection types for the node.
    //
    this.validConnectionTypes = function() {
      return this.data.validConnectionTypes || [];
    };

    //
    // Is this node valid for current connection?
    //
    this.invalid = function() {
      return this.data.invalid;
    };

    //
    // set node valid
    //
    this.setInvalid = function(value) {
      this.data.invalid = value;
    };

    //
    // Height of the node.
    //
    this.height = function() {
      /*
       var numConnectors =
       Math.max(
       this.inputConnectors.length,
       this.outputConnectors.length);

       return pfCanvas.computeConnectorY(numConnectors);
       */

      return pfCanvas.defaultNodeHeight;
    };

    //
    // Select the node.
    //
    this.select = function() {
      this._selected = true;
    };

    //
    // Deselect the node.
    //
    this.deselect = function() {
      this._selected = false;
    };

    //
    // Toggle the selection state of the node.
    //
    this.toggleSelected = function() {
      this._selected = !this._selected;
    };

    //
    // Returns true if the node is selected.
    //
    this.selected = function() {
      return this._selected;
    };

    //
    // Internal function to add a connector.
    this._addConnector = function(connectorDataModel, x, connectorsDataModel, connectorsViewModel) {
      var connectorViewModel = new pfCanvas.ConnectorViewModel(connectorDataModel, x,
        pfCanvas.computeConnectorY(connectorsViewModel.length), this);

      connectorsDataModel.push(connectorDataModel);

      // Add to node's view model.
      connectorsViewModel.push(connectorViewModel);

      return connectorViewModel;
    };

    //
    // Internal function to remove a connector.
    this._removeConnector = function(connectorDataModel, connectorsDataModel, connectorsViewModel) {
      var connectorIndex = connectorsDataModel.indexOf(connectorDataModel);
      connectorsDataModel.splice(connectorIndex, 1);
      connectorsViewModel.splice(connectorIndex, 1);
    };

    //
    // Add an input connector to the node.
    //
    this.addInputConnector = function(connectorDataModel) {
      if (!this.data.inputConnectors) {
        this.data.inputConnectors = [];
      }
      this._addConnector(connectorDataModel, 0, this.data.inputConnectors, this.inputConnectors);
    };

    //
    // Get the single ouput connector for the node.
    //
    this.getOutputConnector = function() {
      if (!this.data.outputConnectors) {
        this.data.outputConnectors = [];
      }

      if (this.data.outputConnectors.length === 0) {
        var connectorDataModel = {name: 'out'};

        return this._addConnector(connectorDataModel, this.data.width, this.data.outputConnectors, this.outputConnectors);
      } else {
        return this.outputConnectors[0];
      }
    };

    //
    // Remove an ouput connector from the node.
    //
    this.removeOutputConnector = function(connectorDataModel) {
      if (this.data.outputConnectors) {
        this._removeConnector(connectorDataModel, this.data.outputConnectors, this.outputConnectors);
      }
    };

    this.tags = function() {
      return this.data.tags;
    };
  };

  //
  // Wrap the nodes data-model in a view-model.
  //
  var createNodesViewModel = function(nodesDataModel) {
    var nodesViewModel = [];

    if (nodesDataModel) {
      for (var i = 0; i < nodesDataModel.length; ++i) {
        nodesViewModel.push(new pfCanvas.NodeViewModel(nodesDataModel[i]));
      }
    }

    return nodesViewModel;
  };

  //
  // View model for a node action.
  //
  pfCanvas.NodeActionViewModel = function(nodeActionDataModel) {
    this.data = nodeActionDataModel;

    //
    // id of the node action.
    //
    this.id = function() {
      return this.data.id || "";
    };

    //
    // Name of the node action.
    //
    this.name = function() {
      return this.data.name || "";
    };

    //
    // Font Family for the the node.
    //
    this.iconClass = function() {
      return this.data.iconClass || "";
    };

    //
    // Font Content for the the node.
    //
    this.action = function() {
      return this.data.action || "";
    };
  };

  //
  // Wrap the node actions data-model in a view-model.
  //
  var createNodeActionsViewModel = function(nodeActionsDataModel) {
    var nodeActionsViewModel = [];

    if (nodeActionsDataModel) {
      for (var i = 0; i < nodeActionsDataModel.length; ++i) {
        nodeActionsViewModel.push(new pfCanvas.NodeActionViewModel(nodeActionsDataModel[i]));
      }
    }

    return nodeActionsViewModel;
  };

  //
  // View model for a connection.
  //
  pfCanvas.ConnectionViewModel = function(connectionDataModel, sourceConnector, destConnector) {
    this.data = connectionDataModel;
    this.source = sourceConnector;
    this.dest = destConnector;

    // Set to true when the connection is selected.
    this._selected = false;

    this.name = function() {
      return destConnector.name() || "";
    };

    this.sourceCoordX = function() {
      return this.source.parentNode().x() + this.source.x();
    };

    this.sourceCoordY = function() {
      return this.source.parentNode().y() + this.source.y();
    };

    this.sourceCoord = function() {
      return {
        x: this.sourceCoordX(),
        y: this.sourceCoordY(),
      };
    };

    this.sourceTangentX = function() {
      return pfCanvas.computeConnectionSourceTangentX(this.sourceCoord(), this.destCoord());
    };

    this.sourceTangentY = function() {
      return pfCanvas.computeConnectionSourceTangentY(this.sourceCoord(), this.destCoord());
    };

    this.destCoordX = function() {
      return this.dest.parentNode().x() + this.dest.x();
    };

    this.destCoordY = function() {
      return this.dest.parentNode().y() + this.dest.y();
    };

    this.destCoord = function() {
      return {
        x: this.destCoordX(),
        y: this.destCoordY(),
      };
    };

    this.destTangentX = function() {
      return pfCanvas.computeConnectionDestTangentX(this.sourceCoord(), this.destCoord());
    };

    this.destTangentY = function() {
      return pfCanvas.computeConnectionDestTangentY(this.sourceCoord(), this.destCoord());
    };

    this.middleX = function(scale) {
      if (angular.isUndefined(scale)) {
        scale = 0.5;
      }

      return this.sourceCoordX() * (1 - scale) + this.destCoordX() * scale;
    };

    this.middleY = function(scale) {
      if (angular.isUndefined(scale)) {
        scale = 0.5;
      }

      return this.sourceCoordY() * (1 - scale) + this.destCoordY() * scale;
    };

    //
    // Select the connection.
    //
    this.select = function() {
      this._selected = true;
    };

    //
    // Deselect the connection.
    //
    this.deselect = function() {
      this._selected = false;
    };

    //
    // Toggle the selection state of the connection.
    //
    this.toggleSelected = function() {
      this._selected = !this._selected;
    };

    //
    // Returns true if the connection is selected.
    //
    this.selected = function() {
      return this._selected;
    };
  };

  //
  // Helper function.
  //
  var computeConnectionTangentOffset = function(pt1, pt2) {
    return (pt2.x - pt1.x) / 2;
  };

  //
  // Compute the tangent for the bezier curve.
  //
  pfCanvas.computeConnectionSourceTangentX = function(pt1, pt2) {
    return pt1.x + computeConnectionTangentOffset(pt1, pt2);
  };

  //
  // Compute the tangent for the bezier curve.
  //
  pfCanvas.computeConnectionSourceTangentY = function(pt1, pt2) {
    return pt1.y;
  };

  //
  // Compute the tangent for the bezier curve.
  //
  pfCanvas.computeConnectionSourceTangent = function(pt1, pt2) {
    return {
      x: pfCanvas.computeConnectionSourceTangentX(pt1, pt2),
      y: pfCanvas.computeConnectionSourceTangentY(pt1, pt2),
    };
  };

  //
  // Compute the tangent for the bezier curve.
  //
  pfCanvas.computeConnectionDestTangentX = function(pt1, pt2) {
    return pt2.x - computeConnectionTangentOffset(pt1, pt2);
  };

  //
  // Compute the tangent for the bezier curve.
  //
  pfCanvas.computeConnectionDestTangentY = function(pt1, pt2) {
    return pt2.y;
  };

  //
  // Compute the tangent for the bezier curve.
  //
  pfCanvas.computeConnectionDestTangent = function(pt1, pt2) {
    return {
      x: pfCanvas.computeConnectionDestTangentX(pt1, pt2),
      y: pfCanvas.computeConnectionDestTangentY(pt1, pt2),
    };
  };

  //
  // View model for the chart.
  //
  pfCanvas.ChartViewModel = function(chartDataModel) {
    //
    // Find a specific node within the chart.
    //
    this.findNode = function(nodeID) {
      for (var i = 0; i < this.nodes.length; ++i) {
        var node = this.nodes[i];
        if (node.data.id === nodeID) {
          return node;
        }
      }

      throw new Error("Failed to find node " + nodeID);
    };

    //
    // Find a specific input connector within the chart.
    //
    this.findInputConnector = function(nodeID, connectorIndex) {
      var node = this.findNode(nodeID);

      if (!node.inputConnectors || node.inputConnectors.length <= connectorIndex) {
        throw new Error("Node " + nodeID + " has invalid input connectors.");
      }

      return node.inputConnectors[connectorIndex];
    };

    //
    // Find a specific output connector within the chart.
    //
    this.findOutputConnector = function(nodeID, connectorIndex) {
      var node = this.findNode(nodeID);

      /*if (!node.outputConnectors || node.outputConnectors.length < connectorIndex) {
        throw new Error("Node " + nodeID + " has invalid output connectors.");
      }

      return node.outputConnectors[connectorIndex];*/
      return node.getOutputConnector();
    };

    //
    // Create a view model for connection from the data model.
    //
    this._createConnectionViewModel = function(connectionDataModel) {
      var sourceConnector = this.findOutputConnector(connectionDataModel.source.nodeID, connectionDataModel.source.connectorIndex);
      var destConnector = this.findInputConnector(connectionDataModel.dest.nodeID, connectionDataModel.dest.connectorIndex);

      sourceConnector.setConnected(true);
      destConnector.setConnected(true);
      return new pfCanvas.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
    };

    //
    // Wrap the connections data-model in a view-model.
    //
    this._createConnectionsViewModel = function(connectionsDataModel) {
      var connectionsViewModel = [];

      if (connectionsDataModel) {
        for (var i = 0; i < connectionsDataModel.length; ++i) {
          connectionsViewModel.push(this._createConnectionViewModel(connectionsDataModel[i]));
        }
      }

      return connectionsViewModel;
    };

    // Reference to the underlying data.
    this.data = chartDataModel;

    // Create a view-model for nodes.
    this.nodes = createNodesViewModel(this.data.nodes);

    // Create a view-model for nodes.
    this.nodeActions = createNodeActionsViewModel(this.data.nodeActions);

    // Create a view-model for connections.
    this.connections = this._createConnectionsViewModel(this.data.connections);

    // Are there any valid connections (used in connection mode) ?
    this.validConnections = true;

    // Create a view-model for zoom.
    this.zoom = new pfCanvas.ZoomViewModel();

    // Flag to indicate in connecting mode
    this.inConnectingMode = false;

    // Flag to indicate whether the chart was just clicked on.
    this.clickedOnChart = false;

    //
    // Create a view model for a new connection.
    //
    this.createNewConnection = function(startConnector, endConnector) {
      var connectionsDataModel = this.data.connections;
      if (!connectionsDataModel) {
        connectionsDataModel = this.data.connections = [];
      }

      var connectionsViewModel = this.connections;
      if (!connectionsViewModel) {
        connectionsViewModel = this.connections = [];
      }

      var startNode = startConnector.parentNode();
      var startConnectorIndex = startNode.outputConnectors.indexOf(startConnector);
      startConnector = startNode.outputConnectors[startConnectorIndex];
      var startConnectorType = 'output';
      if (startConnectorIndex === -1) {
        startConnectorIndex = startNode.inputConnectors.indexOf(startConnector);
        startConnectorType = 'input';
        if (startConnectorIndex === -1) {
          throw new Error("Failed to find source connector within either inputConnectors or outputConnectors of source node.");
        }
      }

      var endNode = endConnector.parentNode();
      var endConnectorIndex = endNode.inputConnectors.indexOf(endConnector);
      endConnector = endNode.inputConnectors[endConnectorIndex];
      var endConnectorType = 'input';
      if (endConnectorIndex === -1) {
        endConnectorIndex = endNode.outputConnectors.indexOf(endConnector);
        endConnectorType = 'output';
        if (endConnectorIndex === -1) {
          throw new Error("Failed to find dest connector within inputConnectors or outputConnectors of dest node.");
        }
      }

      if (startConnectorType === endConnectorType) {
        throw new Error("Failed to create connection. Only output to input connections are allowed.");
      }

      if (startNode === endNode) {
        throw new Error("Failed to create connection. Cannot link a node with itself.");
      }

      startNode = {
        nodeID: startNode.data.id,
        connectorIndex: startConnectorIndex,
      };

      endNode = {
        nodeID: endNode.data.id,
        connectorIndex: endConnectorIndex,
      };

      var connectionDataModel = {
        source: startConnectorType === 'output' ? startNode : endNode,
        dest: startConnectorType === 'output' ? endNode : startNode,
      };
      connectionsDataModel.push(connectionDataModel);

      var outputConnector = startConnectorType === 'output' ? startConnector : endConnector;
      var inputConnector = startConnectorType === 'output' ? endConnector : startConnector;

      var connectionViewModel = new pfCanvas.ConnectionViewModel(connectionDataModel, outputConnector, inputConnector);
      connectionsViewModel.push(connectionViewModel);

      startConnector.setConnected(true);
      endConnector.setConnected(true);
    };

    //
    // Add a node to the view model.
    //
    this.addNode = function(nodeDataModel) {
      if (!this.data.nodes) {
        this.data.nodes = [];
      }

      //
      // Update the data model.
      //
      this.data.nodes.push(nodeDataModel);

      //
      // Update the view model.
      //
      this.nodes.push(new pfCanvas.NodeViewModel(nodeDataModel));
    };

    //
    // Select all nodes and connections in the chart.
    //
    this.selectAll = function() {
      var nodes = this.nodes;
      for (var i = 0; i < nodes.length; ++i) {
        var node = nodes[i];
        node.select();
      }

      var connections = this.connections;
      for (i = 0; i < connections.length; ++i) {
        var connection = connections[i];
        connection.select();
      }
    };

    //
    // Deselect all nodes and connections in the chart.
    //
    this.deselectAll = function() {
      var nodes = this.nodes;
      for (var i = 0; i < nodes.length; ++i) {
        var node = nodes[i];
        node.deselect();
        // close any/all open toolbar dialogs
        node.toolbarDlgOpen = false;
      }

      var connections = this.connections;
      for (i = 0; i < connections.length; ++i) {
        var connection = connections[i];
        connection.deselect();
      }
    };

    //
    // Mark nodes & connectors as valid/invalid based on source node's
    // valid connection types
    //
    this.updateValidNodesAndConnectors = function(sourceNode) {
      this.validConnections = false;
      var validConnectionTypes = sourceNode.validConnectionTypes();
      for (var i = 0; i < this.nodes.length; ++i) {
        var node = this.nodes[i];
        node.setInvalid(true);
        for (var c = 0; c < node.inputConnectors.length; c++) {
          var inputConnector = node.inputConnectors[c];
          inputConnector.setInvalid(validConnectionTypes.indexOf(inputConnector.data.type) === -1);
          if (!inputConnector.invalid() && node !== sourceNode && !inputConnector.connected()) {
            node.setInvalid(false);
            this.validConnections = true;
          }
        }
      }
    };

    //
    // Mark nodes & connectors as valid
    //
    this.resetValidNodesAndConnectors = function() {
      for (var i = 0; i < this.nodes.length; ++i) {
        var node = this.nodes[i];
        node.setInvalid(false);
        for (var c = 0; c < node.inputConnectors.length; c++) {
          var inputConnector = node.inputConnectors[c];
          inputConnector.setInvalid(false);
        }
      }
    };

    this.removeOutputConnector = function(connectorViewModel) {
      var parentNode = connectorViewModel.parentNode();
      parentNode.removeOutputConnector(connectorViewModel.data);
    };

    //
    // Update the location of the node and its connectors.
    //
    this.updateSelectedNodesLocation = function(deltaX, deltaY) {
      var selectedNodes = this.getSelectedNodes();

      for (var i = 0; i < selectedNodes.length; ++i) {
        var node = selectedNodes[i];
        node.data.x += deltaX;
        node.data.y += deltaY;
      }
    };

    //
    // Handle mouse click on a particular node.
    //
    this.handleNodeClicked = function(node, ctrlKey) {
      if (ctrlKey) {
        node.toggleSelected();
      } else {
        this.deselectAll();
        node.select();
      }

      // Move node to the end of the list so it is rendered after all the other.
      // This is the way Z-order is done in SVG.

      var nodeIndex = this.nodes.indexOf(node);
      if (nodeIndex === -1) {
        throw new Error("Failed to find node in view model!");
      }
      this.nodes.splice(nodeIndex, 1);
      this.nodes.push(node);
    };

    //
    // Handle mouse down on a connection.
    //
    this.handleConnectionMouseDown = function(connection, ctrlKey) {
      if (ctrlKey) {
        connection.toggleSelected();
      } else {
        this.deselectAll();
        connection.select();
      }
    };

    //
    // Delete all nodes and connections that are selected.
    //
    this.duplicateSelectedNode = function() {
      var duplicatedNode = angular.copy(this.getSelectedNodes()[0]);
      delete duplicatedNode.data.outputConnectors;
      return duplicatedNode.data;
    };

    //
    // Delete all nodes and connections that are selected.
    //
    this.deleteSelected = function() {
      var newNodeViewModels = [];
      var newNodeDataModels = [];

      var deletedNodeIds = [];

      //
      /* Sort nodes into:
       *		nodes to keep and
       *		nodes to delete.
       */

      for (var nodeIndex = 0; nodeIndex < this.nodes.length; ++nodeIndex) {
        var node = this.nodes[nodeIndex];
        if (!node.selected()) {
          // Only retain non-selected nodes.
          newNodeViewModels.push(node);
          newNodeDataModels.push(node.data);
        } else {
          // Keep track of nodes that were deleted, so their connections can also
          // be deleted.
          deletedNodeIds.push(node.data.id);
        }
      }

      var newConnectionViewModels = [];
      var newConnectionDataModels = [];

      //
      // Remove connections that are selected.
      // Also remove connections for nodes that have been deleted.
      //
      for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {
        var connection = this.connections[connectionIndex];
        if (!connection.selected()) {
          if (deletedNodeIds.indexOf(connection.data.source.nodeID) === -1
            && deletedNodeIds.indexOf(connection.data.dest.nodeID) === -1) {
            //
            // The nodes this connection is attached to, where not deleted,
            // so keep the connection.
            //
            newConnectionViewModels.push(connection);
            newConnectionDataModels.push(connection.data);
          }
        } else {
          // connection selected, so it will be deleted (ie. not included in the 'newConnection models)
          // also delete the connection's source node's output connector (if source node hasn't been deleteed
          if (deletedNodeIds.indexOf(connection.data.source.nodeID) === -1) {
            var sourceConnectorViewModel = connection.source;
            if (sourceConnectorViewModel) {
              sourceConnectorViewModel._parentNode.removeOutputConnector(sourceConnectorViewModel.data);
              // also set connected to false on the dest node
              var destConnectorViewModel = connection.dest;
              if (destConnectorViewModel) {
                destConnectorViewModel.setConnected(false);
              } else {
                throw new Error("Failed to find dest node of deleted connection!");
              }
            } else {
              throw new Error("Failed to find source node of deleted connection!");
            }
          }
        }
      }

      //
      // Update nodes and connections.
      //
      this.nodes = newNodeViewModels;
      this.data.nodes = newNodeDataModels;
      this.connections = newConnectionViewModels;
      this.data.connections = newConnectionDataModels;
    };

    //
    // Select nodes and connections that fall within the selection rect.
    //
    this.applySelectionRect = function(selectionRect) {
      this.deselectAll();

      for (var i = 0; i < this.nodes.length; ++i) {
        var node = this.nodes[i];
        if (node.x() >= selectionRect.x
          && node.y() >= selectionRect.y
          && node.x() + node.width() <= selectionRect.x + selectionRect.width
          && node.y() + node.height() <= selectionRect.y + selectionRect.height) {
          // Select nodes that are within the selection rect.
          node.select();
        }
      }

      for (i = 0; i < this.connections.length; ++i) {
        var connection = this.connections[i];
        if (connection.source.parentNode().selected()
          && connection.dest.parentNode().selected()) {
          // Select the connection if both its parent nodes are selected.
          connection.select();
        }
      }
    };

    //
    // Get the array of nodes that are currently selected.
    //
    this.getSelectedNodes = function() {
      var selectedNodes = [];

      for (var i = 0; i < this.nodes.length; ++i) {
        var node = this.nodes[i];
        if (node.selected()) {
          selectedNodes.push(node);
        }
      }

      return selectedNodes;
    };

    //
    // Is only one node selected
    //
    this.isOnlyOneNodeSelected = function() {
      return this.getSelectedNodes().length === 1;
    };

    //
    // Are any nodes selected
    //
    this.areAnyNodesSelected = function() {
      return this.getSelectedNodes().length > 0;
    };

    //
    // Get the array of connections that are currently selected.
    //
    this.getSelectedConnections = function() {
      var selectedConnections = [];

      for (var i = 0; i < this.connections.length; ++i) {
        var connection = this.connections[i];
        if (connection.selected()) {
          selectedConnections.push(connection);
        }
      }

      return selectedConnections;
    };
  };

  //
  // Zoom view model
  //
  pfCanvas.ZoomViewModel = function() {
    this.max = 1; // Max zoom level
    this.min = parseFloat(".5"); // Min zoom level
    this.inc = parseFloat(".25"); // Zoom level increment
    this.level = this.max; // Zoom level

    //
    // Is max zoom
    //
    this.isMax = function() {
      return (this.level === this.max);
    };

    //
    // Is min zoom
    //
    this.isMin = function() {
      return (this.level === this.min);
    };

    //
    // Get background image size
    //
    this.getBackgroundSize = function() {
      var size = pfCanvas.defaultBgImageSize * this.getLevel();

      return size;
    };

    //
    // Get height to accomodate flow chart
    //
    this.getChartHeight = function() {
      var height = (pfCanvas.defaultHeight / this.min) * this.getLevel();

      return height;
    };

    //
    // Get width to accomodate flow chart
    //
    this.getChartWidth = function() {
      var width = (pfCanvas.defaultWidth / this.min) * this.getLevel();

      return width;
    };

    //
    // Zoom level
    //
    this.getLevel = function() {
      return this.level;
    };

    //
    // Zoom in
    //
    this.in = function() {
      if (!this.isMax()) {
        this.level = (this.level * 10 + this.inc * 10) / 10;
      }
    };

    //
    // Zoom out
    //
    this.out = function() {
      if (!this.isMin()) {
        this.level = (this.level * 10 - this.inc * 10) / 10;
      }
    };
  };
})();
;(function () {
  'use strict';

  // Service used to help with dragging and clicking on elements.
  angular.module('dragging', ['mouseCapture'])
    .factory('dragging', ['mouseCapture', Factory]);

  function Factory (mouseCapture) {
    //
    // Threshold for dragging.
    // When the mouse moves by at least this amount dragging starts.
    //
    var threshold = 5;

    return {

      //
      // Called by users of the service to register a mousedown event and start dragging.
      // Acquires the 'mouse capture' until the mouseup event.
      //
      startDrag: function (evt, config) {
        var dragging = false;
        var x = evt.pageX;
        var y = evt.pageY;

        //
        // Handler for mousemove events while the mouse is 'captured'.
        //
        var mouseMove = function (evt) {
          if (!dragging) {
            if (Math.abs(evt.pageX - x) > threshold
              || Math.abs(evt.pageY - y) > threshold) {
              dragging = true;

              if (config.dragStarted) {
                config.dragStarted(x, y, evt);
              }

              if (config.dragging) {
                // First 'dragging' call to take into account that we have
                // already moved the mouse by a 'threshold' amount.
                config.dragging(evt.pageX, evt.pageY, evt);
              }
            }
          } else {
            if (config.dragging) {
              config.dragging(evt.pageX, evt.pageY, evt);
            }

            x = evt.pageX;
            y = evt.pageY;
          }
        };

        //
        // Handler for when mouse capture is released.
        //
        var released = function () {
          if (dragging) {
            if (config.dragEnded) {
              config.dragEnded();
            }
          } else {
            if (config.clicked) {
              config.clicked();
            }
          }
        };

        //
        // Handler for mouseup event while the mouse is 'captured'.
        // Mouseup releases the mouse capture.
        //
        var mouseUp = function (evt) {
          mouseCapture.release();

          evt.stopPropagation();
          evt.preventDefault();
        };

        //
        // Acquire the mouse capture and start handling mouse events.
        //
        mouseCapture.acquire(evt, {
          mouseMove: mouseMove,
          mouseUp: mouseUp,
          released: released,
        });

        evt.stopPropagation();
        evt.preventDefault();
      },

    };
  }
})();

;(function () {
  "use strict";

  // Service used to acquire 'mouse capture' then receive dragging events while the mouse is captured.
  angular.module('mouseCapture', [])
    .factory('mouseCapture', ['$rootScope', Factory])
    .directive('mouseCapture', [ComponentDirective]);

  function Factory ($rootScope) {
    //
    // Element that the mouse capture applies to, defaults to 'document'
    // unless the 'mouse-capture' directive is used.
    //
    var $element = document;

    //
    // Set when mouse capture is acquired to an object that contains
    // handlers for 'mousemove' and 'mouseup' events.
    //
    var mouseCaptureConfig = null;

    //
    // Handler for mousemove events while the mouse is 'captured'.
    //
    var mouseMove = function (evt) {
      if (mouseCaptureConfig && mouseCaptureConfig.mouseMove) {
        mouseCaptureConfig.mouseMove(evt);

        $rootScope.$digest();
      }
    };

    //
    // Handler for mouseup event while the mouse is 'captured'.
    //
    var mouseUp = function (evt) {
      if (mouseCaptureConfig && mouseCaptureConfig.mouseUp) {
        mouseCaptureConfig.mouseUp(evt);

        $rootScope.$digest();
      }
    };

    return {

      //
      // Register an element to use as the mouse capture element instead of
      // the default which is the document.
      //
      registerElement: function (element) {
        $element = element;
      },

      //
      // Acquire the 'mouse capture'.
      // After acquiring the mouse capture mousemove and mouseup events will be
      // forwarded to callbacks in 'config'.
      //
      acquire: function (evt, config) {
        //
        // Release any prior mouse capture.
        //
        this.release();

        mouseCaptureConfig = config;

        //
        // In response to the mousedown event register handlers for mousemove and mouseup
        // during 'mouse capture'.
        //
        $element.mousemove(mouseMove);
        $element.mouseup(mouseUp);
      },

      //
      // Release the 'mouse capture'.
      //
      release: function () {
        if (mouseCaptureConfig) {
          if (mouseCaptureConfig.released) {
            //
            // Let the client know that their 'mouse capture' has been released.
            //
            mouseCaptureConfig.released();
          }

          mouseCaptureConfig = null;
        }

        $element.unbind("mousemove", mouseMove);
        $element.unbind("mouseup", mouseUp);
      },
    };
  }

  function ComponentDirective () {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', 'mouseCapture',
        function ($scope, $element, $attrs, mouseCapture) {
          //
          // Register the directives element as the mouse capture element.
          //
          mouseCapture.registerElement($element);
        }],

    };
  }
})();

;(function () {
  'use strict';

  nodeToolbarDirective.$inject = ["$document"];
  angular.module('patternfly.canvas')
    .directive('nodeToolbar', nodeToolbarDirective);

  function nodeToolbarDirective ($document) {
    var directive = {
      restrict: 'E',
      scope: {
        node: '=',
        nodeActions: '=',
      },
      controller: NodeToolbarController,
      templateUrl: 'canvas-view/canvas/node-toolbar.html',
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    function NodeToolbarController ($scope) {
      var vm = this;
      vm.selectedAction = "none";

      $scope.actionIconClicked = function (action) {
        vm.selectedAction = action;
        $scope.$emit('nodeActionClicked', {'action': action, 'node': vm.node});
      };

      $scope.close = function () {
        vm.selectedAction = 'none';
        $scope.$emit('nodeActionClosed');
      };
    }
  }
})();
;/**
 * @ngdoc directive
 * @name patternfly.canvas.directive:pfCanvas
 * @restrict E
 *
 * @description
 * Directive for core operations and rendering of a canvas. Does not work in IE 11 or lower because they do not support
 * latest svg specification's 'foreignObject' api.  Tested in FireFox, Chrome, and MS-Edge.
 * @param {object} chartDataModel Chart data object which defines the nodes and connections on the canvas
 * <ul style='list-style-type: none'>
 *   <li>.nodes  - An array of node objects.  For each node's main icon/image you can define either an <em>image url</em>, an <em>icon class</em>, or
 *   <em>fontContent</em> unicode characters.  For more information please see the details below:
 *   <ul style='list-style-type: none'>
 *     <li>.name     - (string) The name of the node
 *     <li>.x        - (number) The canvas x-coordinate to place the node
 *     <li>.y        - (number) The canvas y-coordinate to place the node
 *     <li>.id       - (number) The node id.  Used to define connections between nodes.
 *     <li>.width    - (number) The width of the node rectangle
 *     <li>.image    - (string) (Optional) The url of the main node image.  Ex: "/img/kubernetes.svg"
 *     <li>.icon     - (string) (Optional) The icon class of the node icon.  Ex: "pf pficon-service" Note: Does not work in IE browsers
 *     <li>.fontSize - (string) (Optional) The size of the main node icon. Used with <em>icon</em>
 *     <li>.fontFamily  - (string) (Optional) The font family of the node icon. Ex: "fontawesome"
 *     <li>.fontContent - (string) (Optional) The unicode characters of the node icon. Used with <em>fontFamily</em>. Ex: "\uf0c2"
 *     <li>.backgroundColor - (string) The background color of the node rectangle
 *     <li>.inputConnectors - An array of input connectors.  Connectors appear on the left side of a node's rectangle when in 'connection mode' and are endpoints of connections between nodes.
 *     <ul style='list-style-type: none'>
 *       <li>.name        - (string) The name of the connector
 *       <li>.type        - (string) A user defined 'type' of input connector.  Nodes can only connect to certain 'types' of connectors.  Used with <em>validConnectionTypes</em>. Ex: "network".
 *       <li>.fontFamily  - (string) (Optional) The font family of the connector icon. Ex: "PatternFlyIcons-webfont"
 *       <li>.fontContent - (string) (Optional) The unicode characters of the connector icon. Used with <em>fontFamily</em>. Ex: "\ue621"
 *     </ul>
 *     <li>.validConnectionTypes - An array of valid connector types which the node can connect to. Used with <em>node.type's</em>. Ex: "["network","container"]
 *   </ul>
 *   <li>.nodeActions  - An array of actions which appear in a toolbar under a node.
 *     <ul style='list-style-type: none'>
 *       <li>.id        - (number) The id of the node action
 *       <li>.name      - (string) The name of the node action
 *       <li>.iconClass - (string) The icon class of the action.  Ex: "pf pficon-edit"
 *       <li>.action    - (string) The action identifier, which is passed along with the action event.
 *     </ul>
 *   <li>.connections  - An array of connections between nodes
 *     <ul style='list-style-type: none'>
 *       <li>.source - (object) The source of a connection
 *         <ul style='list-style-type: none'>
 *           <li>.nodeID         - (number) The id of the source node
 *           <li>.connectorIndex - (number) The index of the output connector on the source node.  Since all nodes have a single output connector, this value is always 0
 *         </ul>
 *       <li>.dest - (object) The destination/target of a connection
 *         <ul style='list-style-type: none'>
 *           <li>.nodeID         - (number) The id of the destination node
 *           <li>.connectorIndex - (number) The index of the input connector on the dest/target node to connect.  Zero equals the top input connector, increment for subsequent input connectors.
 *         </ul>
 *     </ul>
 * </ul>
 * @param {object} chartViewModel (Optional) The chartViewModel is initialized from the chartDataModel and contains additional helper methods such as <code>chartViewModel.isOnlyOneNodeSelected()</code> and
 * <code>chartViewModel.getSelectedNodes()</code>.  You only need to specify a chartViewModel object if you plan on using advanced canvas operations.
 * @param {boolean} readOnly A flag indicating whether the canvas is in 'read-only' mode.  When in 'read-only' mode nodes cannot be moved, selected, or deleted, and the node action toolbar is hidden.
 * @param {boolean} hideConnectors A flag indicating whether connections should be hidden or shown on the canvas
 * @example
 <example module="patternfly.canvas.demo">
 <file name="index.html">
   <style>
     .canvas {
         background-image: url('/img/canvas-dot-grid.png');
         background-repeat: repeat;
     }
   </style>
   <div ng-controller="CanvasDemoCtrl" class="example-container">
     <div class="canvas-demo-container">
       <pf-canvas chart-data-model="chartDataModel"
                  chart-view-model="chartViewModel"
                  read-only="readOnly"
                  hide-connectors="hideConnectors">
       </pf-canvas>
     </div>
     <hr>
     <div class="form-group">
       <label class="checkbox-inline">
         <input type="checkbox" ng-model="readOnly">Read Only</input>
       </label>

       <label class="checkbox-inline">
         <input type="checkbox" ng-model="hideConnectors">Hide Connections</input>
       </label>

       <button ng-click="addNode()" style="margin-left: 10px;">Add Node</button>

       <button ng-click="selectAll()" style="margin-left: 10px;">Select All (Ctrl+A)</button>
       <button ng-click="deselectAll()">Deselect All (esc key)</button>
       <button ng-click="deleteSelected()">Delete Selected (delete key)</button>

       <button ng-click="zoomIn()" style="margin-left: 10px;">Zoom In</button>
       <button ng-click="zoomOut()">Zoom Out</button>
     </div>
     <div style="padding-top: 12px;">
       <label style="font-weight:normal;vertical-align:middle;">Events: </label>
     </div>
     <div>
       <textarea rows="10" class="col-md-12">{{eventText}}</textarea>
     </div>
   </div>
 </file>

 <file name="modules.js">
   angular.module('patternfly.canvas.demo', ['patternfly.canvas']);
 </file>

 <file name="script.js">
 angular.module( 'patternfly.canvas.demo' ).controller( 'CanvasDemoCtrl', function( $scope ) {
     $scope.chartDataModel = {
          "nodes": [
            {
              "name": "Nuage",
              "x": 345,
              "y": 67,
              "id": 1,
              "image": "/img/OpenShift-logo.svg",
              "width": 150,
              "bundle": true,
              "backgroundColor": "#fff",
              "inputConnectors": [
                {
                  "name": "Network",
                  "type": "network",
                  "fontFamily": "PatternFlyIcons-webfont",
                  "fontContent": "\ue909"
                },
                {
                  "name": "Container",
                  "type": "container",
                  "fontFamily": "PatternFlyIcons-webfont",
                  "fontContent": "\ue621"
                }
              ],
              "validConnectionTypes": ["network", "container"]
            },
            {
              "name": "Vmware",
              "x": 100,
              "y": 290,
              "id": 2,
              "image": "/img/kubernetes.svg",
              "width": 150,
              "backgroundColor": "#fff",
              "validConnectionTypes": ["storage"],
              "inputConnectors": [
                {
                    "name": "Network",
                    "type": "network",
                    "fontFamily": "PatternFlyIcons-webfont",
                    "fontContent": "\ue909"
                  },
                  {
                    "name": "Storage",
                    "type": "storage",
                    "fontFamily": "PatternFlyIcons-webfont",
                    "fontContent": "\ue90e"
                  },
                  {
                    "name": "Container",
                    "type": "container",
                    "fontFamily": "PatternFlyIcons-webfont",
                    "fontContent": "\ue621"
                  }
                ],
            },
            {
              "name": "NetApp",
              "x": 350,
              "y": 291,
              "id": 3,
              "width": 150,
              "icon": "pf pficon-service",
              "fontSize": "76px",
              "backgroundColor": "#fff",
              "inputConnectors": [
                {
                    "name": "Network",
                    "type": "network",
                    "fontFamily": "PatternFlyIcons-webfont",
                    "fontContent": "\ue909"
                  },
                  {
                    "name": "Container",
                    "type": "container",
                    "fontFamily": "PatternFlyIcons-webfont",
                    "fontContent": "\ue621"
                  }
                ],
              "validConnectionTypes": ["network"]
            },
            {
              "name": "OpenShift",
              "x": 105,
              "y": 67,
              "id": 4,
              "width": 150,
              "fontFamily": "fontawesome",
              "fontContent": "\uf0c2",
              "backgroundColor": "#fff",
              "inputConnectors": [
                {
                  "name": "Storage",
                  "type": "storage",
                  "fontFamily": "PatternFlyIcons-webfont",
                  "fontContent": "\ue90e"
                },
                {
                  "name": "Container",
                  "type": "container",
                  "fontFamily": "PatternFlyIcons-webfont",
                  "fontContent": "\ue621"
                }
              ],
              "validConnectionTypes": ["network", "container", "storage"]
            }
          ],
          "nodeActions" : [
            {
              "id": 1,
              "name": "connect",
              "iconClass": "fa fa-share-alt",
              "action": "nodeActionConnect",
            },
            {
              "id": 2,
              "name": "edit",
              "iconClass": "pf pficon-edit",
              "action": "nodeActionEdit",
            },
            {
              "id": 3,
              "name": "tag",
              "iconClass": "fa fa-tag",
              "action": "nodeActionTag",
            },
          ],
          "connections": [
            {
              "source": {
                "nodeID": 4,
                "connectorIndex": 0
              },
              "dest": {
                "nodeID": 1,
                "connectorIndex": 1
              }
            },
            {
              "source": {
                "nodeID": 4,
                "connectorIndex": 0
              },
              "dest": {
                "nodeID": 3,
                "connectorIndex": 0
              }
            }
          ]
     };

     $scope.newNode = {
      "name": "NetApp",
      "id": 1000,
      "width": 150,
      "icon": "pf pficon-service",
      "fontSize": "76px",
      "backgroundColor": "#fff",
      "inputConnectors": [
        {
            "name": "Network",
            "type": "network",
            "fontFamily": "PatternFlyIcons-webfont",
            "fontContent": "\ue909"
          },
          {
            "name": "Container",
            "type": "container",
            "fontFamily": "PatternFlyIcons-webfont",
            "fontContent": "\ue621"
          }
        ],
      "validConnectionTypes": ["network"]
     };

     $scope.chartViewModel;
     $scope.readOnly = false;
     $scope.hideConnectors = false;
     $scope.eventText = "";

     var numNewNodes = 1;

     $scope.addNode = function() {
       var newNode = angular.copy($scope.newNode);
       newNode.id ++;
       newNode.name = newNode.name + " " + numNewNodes++;
       newNode.x = 250 + (numNewNodes * 4 + 160);
       newNode.y = 200 + (numNewNodes * 4 + 160);

       $scope.chartViewModel.addNode(newNode);
     }

     $scope.$on('nodeActionClicked', function(evt, args) {
       var action = args.action;
       var node = args.node;
       $scope.eventText = node.name() + ' ' + action + '\r\n' + $scope.eventText;
     });

     $scope.zoomIn = function() {
       $scope.$broadcast('zoomIn');
     }
     $scope.zoomOut = function() {
       $scope.$broadcast('zoomOut');
     }

     $scope.selectAll = function() {
       $scope.$broadcast('selectAll');
     }
     $scope.deselectAll = function() {
       $scope.$broadcast('deselectAll');
     }
     $scope.deleteSelected = function() {
       $scope.$broadcast('deleteSelected');
     }
 });
 </file>
 </example>
 */
;/**
 * @ngdoc directive
 * @name patternfly.canvas.directive:pfCanvasEditor
 * @restrict E
 *
 * @description
 * Component for canvas editor which adds a toolbox where items can be dragged and dropped onto canvas, as well as other canvas
 * operations such as: Zoom In, Zoom Out, Hide Connections, Remove Node, and Duplicate Node.  Does not work in IE 11 or lower because they do not support
 * latest svg specification's 'foreignObject' api.  Tested in FireFox, Chrome, and MS-Edge.
 *
 * @param {object} chartDataModel Chart data object which defines the nodes and connections on the canvas. See {@link patternfly.canvas.directive:pfCanvas} for detailed information.
 * @param {object} chartViewModel (Optional) The chartViewModel is initialized from the chartDataModel and contains additional helper methods such as <code>chartViewModel.isOnlyOneNodeSelected()</code> and
 * <code>chartViewModel.getSelectedNodes()</code>.
 * @param {boolean} toolboxTabs An array of Tab objects used in the Toolbox.  Each Tab object many contain 'subtabs' and/or 'items'.  Items may be dragged onto the canvas.
 * <ul style='list-style-type: none'>
 *   <li>.preTitle - (string) (Optional) A small title above the main tab title
 *   <li>.title    - (string) The main title of the tab
 *   <li>.subtabs  - (Array) An array of sub Tab objects. Supports up to three levels of nested sub tabs
 *   <li>.items    - (Array) An array of items which can be dragged and dropped onto the canvas
 *   <ul style='list-style-type: none'>
 *     <li>.name     - (string) The item name/title
 *     <li>.id       - (number) The item id
 *     <li>.image    - (string) (Optional) The url of the item's image.  Ex: "/img/kubernetes.svg"
 *     <li>.icon     - (string) (Optional) The icon class of the item's icon.  Ex: "pf pficon-service"
 *   </ul>
 * </ul>
 * @param {boolean} readOnly (Optional) A flag indicating whether the canvas is in 'read-only' mode.  When in 'read-only' mode nodes cannot be moved, selected, or deleted, and the node action toolbar is hidden.
 * @example
 <example module="patternfly.canvaseditor.demo">
 <file name="index.html">
   <style>
     .canvas {
         background-image: url('/img/canvas-dot-grid.png');
         background-repeat: repeat;
     }
   </style>
   <div ng-controller="CanvasEditorDemoCtrl" class="example-container">
     <pf-canvas-editor chart-data-model="chartDataModel"
                       chart-view-model="chartViewModel"
                       toolbox-tabs="toolboxTabs"
                       read-only="readOnly">
       <span ng-if="!readOnly" class="more-actions">
         <a id="duplicateItem" ng-click="duplicateNode()" ng-class="{'disabled': !chartViewModel.isOnlyOneNodeSelected() || chartViewModel.inConnectingMode}">
           <span class="pficon fa fa-copy"
                 tooltip-append-to-body="true" tooltip-placement="bottom"
                 uib-tooltip="{{'Duplicate Item'}}">
           </span>
         </a>
         <a id="deleteNodes" ng-click="deleteNodes()" ng-class="{'disabled': !chartViewModel.areAnyNodesSelected() || chartViewModel.inConnectingMode}">
           <span class="pficon pficon-delete"
                 tooltip-append-to-body="true" tooltip-placement="bottom"
                 uib-tooltip="{{'Delete Selected Items'}}">
           </span>
         </a>
       </span>
     </pf-canvas-editor>
     <hr>
     <div class="form-group">
       <label class="checkbox-inline">
         <input type="checkbox" ng-model="readOnly">Read Only</input>
       </label>
     </div>
     <div style="padding-top: 12px;">
       <label style="font-weight:normal;vertical-align:middle;">Events: </label>
     </div>
     <div>
       <textarea rows="10" class="col-md-12">{{eventText}}</textarea>
     </div>
   </div>
 </file>

 <file name="modules.js">
   angular.module('patternfly.canvaseditor.demo', ['patternfly.canvas']);
 </file>

 <file name="script.js">
 angular.module( 'patternfly.canvaseditor.demo' ).controller( 'CanvasEditorDemoCtrl', function( $scope, $filter ) {
     $scope.chartDataModel = {
          "nodes": [
            {
              "name": "Nuage",
              "x": 345,
              "y": 67,
              "id": 1,
              "image": "/img/OpenShift-logo.svg",
              "width": 150,
              "bundle": true,
              "backgroundColor": "#fff",
              "inputConnectors": [
                {
                  "name": "Network",
                  "type": "network",
                  "fontFamily": "PatternFlyIcons-webfont",
                  "fontContent": "\ue909"
                },
                {
                  "name": "Container",
                  "type": "container",
                  "fontFamily": "PatternFlyIcons-webfont",
                  "fontContent": "\ue621"
                }
              ],
              "validConnectionTypes": ["network", "container"]
            },
            {
              "name": "Vmware",
              "x": 100,
              "y": 290,
              "id": 2,
              "image": "/img/kubernetes.svg",
              "width": 150,
              "backgroundColor": "#fff",
              "validConnectionTypes": ["storage"],
              "inputConnectors": [
                {
                    "name": "Network",
                    "type": "network",
                    "fontFamily": "PatternFlyIcons-webfont",
                    "fontContent": "\ue909"
                  },
                  {
                    "name": "Storage",
                    "type": "storage",
                    "fontFamily": "PatternFlyIcons-webfont",
                    "fontContent": "\ue90e"
                  },
                  {
                    "name": "Container",
                    "type": "container",
                    "fontFamily": "PatternFlyIcons-webfont",
                    "fontContent": "\ue621"
                  }
                ],
            },
            {
              "name": "NetApp",
              "x": 350,
              "y": 291,
              "id": 3,
              "width": 150,
              "icon": "pf pficon-service",
              "fontSize": "76px",
              "backgroundColor": "#fff",
              "inputConnectors": [
                {
                    "name": "Network",
                    "type": "network",
                    "fontFamily": "PatternFlyIcons-webfont",
                    "fontContent": "\ue909"
                  },
                  {
                    "name": "Container",
                    "type": "container",
                    "fontFamily": "PatternFlyIcons-webfont",
                    "fontContent": "\ue621"
                  }
                ],
              "validConnectionTypes": ["network"]
            },
            {
              "name": "OpenShift",
              "x": 105,
              "y": 67,
              "id": 4,
              "width": 150,
              "fontFamily": "fontawesome",
              "fontContent": "\uf0c2",
              "backgroundColor": "#fff",
              "inputConnectors": [
                {
                  "name": "Storage",
                  "type": "storage",
                  "fontFamily": "PatternFlyIcons-webfont",
                  "fontContent": "\ue90e"
                },
                {
                  "name": "Container",
                  "type": "container",
                  "fontFamily": "PatternFlyIcons-webfont",
                  "fontContent": "\ue621"
                }
              ],
              "validConnectionTypes": ["network", "container", "storage"]
            }
          ],
          "nodeActions" : [
            {
              "id": 1,
              "name": "connect",
              "iconClass": "fa fa-share-alt",
              "action": "nodeActionConnect",
            },
            {
              "id": 2,
              "name": "edit",
              "iconClass": "pf pficon-edit",
              "action": "nodeActionEdit",
            },
            {
              "id": 3,
              "name": "tag",
              "iconClass": "fa fa-tag",
              "action": "nodeActionTag",
            },
          ],
          "connections": [
            {
              "source": {
                "nodeID": 4,
                "connectorIndex": 0
              },
              "dest": {
                "nodeID": 1,
                "connectorIndex": 1
              }
            },
            {
              "source": {
                "nodeID": 4,
                "connectorIndex": 0
              },
              "dest": {
                "nodeID": 3,
                "connectorIndex": 0
              }
            }
          ]
     };

     $scope.toolboxTabs = [
       {
         "preTitle": "Toolbox",
         "title": "Items A",
         "active": true,
         "items": [
           {
             "name": "Nuage",
             "id": 10000000000004,
             "image": "/img/OpenShift-logo.svg"
           },
           {
             "name": "Vmware",
             "id": 10000000000010,
             "image": "/img/kubernetes.svg"
           }
         ]
       },
       {
         "preTitle": "Toolbox",
         "title": "Items B",
         "active": true,
         "items": [
           {
             "name": "NetApp",
             "id": 10000000000014,
             "icon": "pf pficon-service"
           },
           {
             "name": "OpenShift",
             "id": 10000000000021,
             "icon": "fa fa-cloud"
           },
           {
             "name": "OpenStack",
             "id": 10000000000022,
             "icon": "pf pficon-network"
           },
           {
             "name": "Storage",
             "id": 10000000000026,
             "icon": "pf pficon-storage-domain"
           },
           {
             "name": "VM",
             "id": 10000000000023,
             "icon": "pf pficon-virtual-machine"
           },
           {
             "name": "Replicatore",
             "id": 10000000000027,
             "icon": "pf pficon-replicator"
           }
         ]
       }
     ];

     $scope.chartViewModel;
     $scope.readOnly = false;
     $scope.eventText = "";

     $scope.$on('nodeActionClicked', function(evt, args) {
       var action = args.action;
       var node = args.node;
       $scope.eventText = node.name() + ' ' + action + '\r\n' + $scope.eventText;
     });

     $scope.deleteNodes = function() {
       if ($scope.chartViewModel.inConnectingMode) {
         return;
       }

       $scope.chartViewModel.deleteSelected();

       angular.element("#deleteNodes").blur();
     };

     $scope.duplicateNode = function() {
       if ($scope.chartViewModel.inConnectingMode) {
         return;
       }

       var duplicatedNode = $scope.chartViewModel.duplicateSelectedNode();

       // Note: node id will be used in connections to/from this duplicated node
       // If id changes, connections array/obj will need to be updated as well
       duplicatedNode.id = Math.floor((Math.random() * 600) + 1);  // random number between 1 and 600
       duplicatedNode.name = getCopyName(duplicatedNode.name);
       duplicatedNode.backgroundColor = '#fff';

       duplicatedNode.x = duplicatedNode.x + 15 * $scope.chartDataModel.nodes.length;
       duplicatedNode.y = duplicatedNode.y + 15 * $scope.chartDataModel.nodes.length;

       $scope.chartViewModel.addNode(duplicatedNode);

       angular.element("#duplicateItem").blur();
     }

     function getCopyName(baseName) {
       // Test to see if we are duplicating an existing 'Copy'
       var baseNameLength = baseName.indexOf(' Copy');
       if (baseNameLength === -1) {
         baseNameLength = baseName.length;
       }
       baseName = baseName.substr(0, baseNameLength);
       var filteredArray = $filter('filter')($scope.chartDataModel.nodes, {name: baseName}, false);
       var copyName = baseName + " Copy" + ((filteredArray.length === 1) ? "" : " " + filteredArray.length);

       return copyName;
    }
 });
 </file>
 </example>
 */
;/**
 * @ngdoc directive
 * @name patternfly.card.component:pfAggregateStatusCard
 * @restrict E
 *
 * @param {object} status Status configuration information<br/>
 * <ul style='list-style-type: none'>
 * <li>.title         - the main title of the aggregate status card
 * <li>.count         - the number count of the main statuses
 * <li>.href          - the href to navigate to if one clicks on the title or count
 * <li>.iconClass     - an icon to display to the left of the count
 * <li>.iconImage     - an image to display to the left of the count
 * <li>.notifications - an array of status icons & counts
 *   <ul style='list-style-type: none'>
 *   <li>.iconClass   - an icon to display to the right of the notification count
 *   <li>.iconImage   - an image to display to the left of the notification count
 *   <li>.count         - the number count of the notification status
 *   <li>.href          - href to navigate to if one clicks on the notification status icon or count
 *   </ul>
 * </ul>
 * When layout='mini', only one notification can be specified:<br>
 * <ul style='list-style-type: none'>
 * <li>...
 * <li><strong>.notification</strong>  - an <em>object</em> of containing a single notification icon & count
 *   <ul style='list-style-type: none'>
 *   <li>.iconClass   - an icon to display to the right of the notification count
 *   <li>.iconImage   - an image to display to the left of the notification count
 *   <li>.count         - the number count of the notification status
 *   <li>.href          - href to navigate to if one clicks on the notification status icon or count
 *   </ul>
 * </ul>
 * @param {boolean=} show-top-border Show/hide the top border, true shows top border, false (default) hides top border
 * @param {string=} layout Various alternative layouts the aggregate status card may have:<br/>
 * <ul style='list-style-type: none'>
 * <li>'mini' displays a mini aggregate status card.  Note: when using 'mini' layout, only one notification can be specified in the status object
 * <li>'tall' displays a tall aggregate status card.  This equals the depreciated 'alt-layout' param.</li>
 * </ul>
 * @deprecated {boolean=} alt-layout Display the aggregate status card in a 'alternate tall' layout.  false (default) displays normal layout, true displays tall layout
 *
 * @description
 * Component for easily displaying status information
 *
 * @example
 <example module="patternfly.card">

 <file name="index.html">
   <div ng-controller="CardDemoCtrl" style="display:inline-block;">
     <div class="col-md-10">
       <label>With Top Border</label>
       <pf-aggregate-status-card status="status" show-top-border="true"></pf-aggregate-status-card>
       <br/>
       <label>No Top Border</label>
       <pf-aggregate-status-card status="status"></pf-aggregate-status-card>
       <br/>
       <label>layout = "mini"</label>
       <pf-aggregate-status-card status="miniAggStatus" show-top-border="true" layout="mini"></pf-aggregate-status-card>
       <pf-aggregate-status-card status="miniAggStatus2" show-top-border="true" layout="mini"></pf-aggregate-status-card>
       <br/>
       <label>layout = "tall"</label>
       <pf-aggregate-status-card status="aggStatusAlt" show-top-border="true" layout="tall"></pf-aggregate-status-card>
       <br/>
       <label>Alternate Layout</label>
       <i>(depreciated, use layout = 'tall' instead)</i>
       </br></br>
       <pf-aggregate-status-card status="aggStatusAlt" show-top-border="true" alt-layout="true"></pf-aggregate-status-card>
     </div>
   </div>
 </file>

 <file name="script.js">
   angular.module( 'patternfly.card' ).controller( 'CardDemoCtrl', function( $scope ) {
    $scope.status = {
      "title":"Nodes",
      "count":793,
      "href":"#",
      "iconClass": "fa fa-shield",
      "notifications":[
        {
          "iconClass":"pficon pficon-error-circle-o",
          "count":4,
          "href":"#"
        },
        {
          "iconClass":"pficon pficon-warning-triangle-o",
          "count":1
        }
      ]
    };

    $scope.aggStatusAlt = {
      "title":"Providers",
      "count":3,
      "notifications":[
        {
          "iconImage":"img/kubernetes.svg",
          "count":1,
          "href":"#"
        },
        {
          "iconImage":"img/OpenShift-logo.svg",
          "count":2,
          "href":"#"
        }
      ]
     };

     $scope.miniAggStatus = {
      "iconClass":"pficon pficon-container-node",
      "title":"Nodes",
      "count":52,
      "href":"#",
      "notification": {
          "iconClass":"pficon pficon-error-circle-o",
          "count":3
        }
     };

     $scope.miniAggStatus2 = {
      "iconClass":"pficon pficon-cluster",
      "title":"Adipiscing",
      "count":9,
      "href":"#",
      "notification":{
          "iconClass":"pficon pficon-ok"
        }
     };
   });
 </file>

 </example>
 */

angular.module( 'patternfly.card' ).component('pfAggregateStatusCard', {
  bindings: {
    status: '=',
    showTopBorder: '@?',
    altLayout: '@?',
    layout: '@?'
  },
  templateUrl: 'card/aggregate-status/aggregate-status-card.html',
  controller: function () {
    'use strict';
    var ctrl = this;
    ctrl.$onInit = function () {
      ctrl.shouldShowTopBorder = (ctrl.showTopBorder === 'true');
      ctrl.isAltLayout = (ctrl.altLayout === 'true' || ctrl.layout === 'tall');
      ctrl.isMiniLayout = (ctrl.layout === 'mini');
    };
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.card.component:pfCard - Utilization
 * @restrict E
 *
 * @param {string} headTitle Title for the card
 * @param {string=} subTitle Sub-Title for the card
 * @param {boolean=} showTopBorder Show/Hide the blue top border. True shows top border, false (default) hides top border
 * @param {boolean=} showTitlesSeparator Show/Hide the grey line between the title and sub-title.
 * True (default) shows the line, false hides the line
 * @param {object=} footer footer configuration properties:<br/>
 * <ul style='list-style-type: none'>
 * <li>.iconClass  - (optional) the icon to show on the bottom left of the footer panel
 * <li>.text       - (optional) the text to show on the bottom left of the footer panel, to the right of the icon
 * <li>.href       - (optional) the href link to navigate to when the footer href is clicked
 * <li>.callBackFn - (optional) user defined function to call when the footer href is clicked
 * </ul>
 * *Note: If a href link and a callBackFn are specified, the href link will be called
 * @param {object=} filter filter configuration properties:<br/>
 * <ul style='list-style-type: none'>
 * <li>.filters    - drop down items for the filter.
 *<pre class=''>
 *  Ex:  'filters' : [{label:'Last 30 Days', value:'30'},
 *                    {label:'Last 15 Days', value:'15'},
 *                    {label:'Today', value:'today'}]</pre>
 * <li>.defaultFilter - integer, 0 based index into the filters array
 * <li>.callBackFn - user defined function to call when a filter is selected
 * </ul>
 * @description
 * Component for easily displaying a card with html content
 *
 * @example
 <example module="demo">

 <file name="index.html">
   <div ng-controller="ChartCtrl">
     <label class="label-title">Card With Multiple Utilization Bars</label>
     <pf-card head-title="System Resources" show-top-border="true" style="width: 65%">
       <pf-utilization-bar-chart chart-data=data2 chart-title=title2 layout=layoutInline units=units2 threshold-error="85" threshold-warning="60"></pf-utilization-bar-chart>
       <pf-utilization-bar-chart chart-data=data3 chart-title=title3 layout=layoutInline units=units3 threshold-error="85" threshold-warning="60"></pf-utilization-bar-chart>
       <pf-utilization-bar-chart chart-data=data4 chart-title=title4 layout=layoutInline units=units4 threshold-error="85" threshold-warning="60"></pf-utilization-bar-chart>
       <pf-utilization-bar-chart chart-data=data5 chart-title=title5 layout=layoutInline units=units5 threshold-error="85" threshold-warning="60"></pf-utilization-bar-chart>
     </pf-card>
   </div>
 </file>
 <file name="script.js">
 angular.module( 'demo', ['patternfly.charts', 'patternfly.card'] ).controller( 'ChartCtrl', function( $scope ) {

       $scope.title2 = 'Memory';
       $scope.units2 = 'GB';

       $scope.data2 = {
         'used': '25',
         'total': '100'
       };

       $scope.title3 = 'CPU Usage';
       $scope.units3 = 'MHz';

       $scope.data3 = {
         'used': '420',
         'total': '500',
       };

       $scope.title4 = 'Disk Usage';
       $scope.units4 = 'TB';
       $scope.data4 = {
         'used': '350',
         'total': '500',
       };

       $scope.title5 = 'Disk I/O';
       $scope.units5 = 'I/Ops';
       $scope.data5 = {
         'used': '450',
         'total': '500',
       };

       $scope.layoutInline = {
         'type': 'inline'
       };
     });
 </file>
 </example>
 */
angular.module('patternfly.card').component('pfCard', {
  transclude: true,
  templateUrl: 'card/basic/card.html',
  bindings: {
    headTitle: '@',
    subTitle: '@?',
    showTopBorder: '@?',
    showTitlesSeparator: '@?',
    footer: '=?',
    filter: '=?'
  },
  controller: function () {
    'use strict';
    var ctrl = this;
    if (ctrl.filter && !ctrl.currentFilter) {
      if (ctrl.filter.defaultFilter) {
        ctrl.currentFilter = ctrl.filter.filters[ctrl.filter.defaultFilter];
      } else {
        ctrl.currentFilter = ctrl.filter.filters[0];
      }
    }

    ctrl.footerCallBackFn = function () {
      ctrl.footerCallBackResult = ctrl.footer.callBackFn();
    };

    ctrl.filterCallBackFn = function (f) {
      ctrl.currentFilter = f;
      if (ctrl.filter.callBackFn) {
        ctrl.filterCallBackResult = ctrl.filter.callBackFn(f);
      }
    };

    ctrl.showHeader = function () {
      return (ctrl.headTitle || ctrl.showFilterInHeader());
    };

    ctrl.showFilterInHeader = function () {
      return (ctrl.filter && ctrl.filter.filters && ctrl.filter.position && ctrl.filter.position === 'header');
    };

    ctrl.showFilterInFooter = function () {
      return (ctrl.filter && ctrl.filter.filters && (!ctrl.filter.position || ctrl.filter.position === 'footer'));
    };

    ctrl.$onInit = function () {
      ctrl.shouldShowTitlesSeparator = (!ctrl.showTitlesSeparator || ctrl.showTitlesSeparator === 'true');
    };
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.card.component:pfCard - Timeframe Filters
 * @restrict E
 *
 * @param {string} headTitle Title for the card
 * @param {string=} subTitle Sub-Title for the card
 * @param {boolean=} showTopBorder Show/Hide the blue top border. True shows top border, false (default) hides top border
 * @param {boolean=} showTitlesSeparator Show/Hide the grey line between the title and sub-title.
 * True (default) shows the line, false hides the line
 * @param {object=} footer footer configuration properties:<br/>
 * <ul style='list-style-type: none'>
 * <li>.iconClass  - (optional) the icon to show on the bottom left of the footer panel
 * <li>.text       - (optional) the text to show on the bottom left of the footer panel, to the right of the icon
 * <li>.href       - (optional) the href link to navigate to when the footer href is clicked
 * <li>.callBackFn - (optional) user defined function to call when the footer href is clicked
 * </ul>
 * *Note: If a href link and a callBackFn are specified, the href link will be called
 * @param {object=} filter filter configuration properties:<br/>
 * <ul style='list-style-type: none'>
 * <li>.filters    - drop down items for the filter.
 *<pre class=''>
 *  Ex:  'filters' : [{label:'Last 30 Days', value:'30'},
 *                    {label:'Last 15 Days', value:'15'},
 *                    {label:'Today', value:'today'}]</pre>
 * <li>.defaultFilter - integer, 0 based index into the filters array
 * <li>.callBackFn - user defined function to call when a filter is selected
 * </ul>
 * @description
 * Component for easily displaying a card with html content
 *
 * @example
 <example module="demo">

 <file name="index.html">
   <div ng-controller="ChartCtrl">
     <label class="label-title">Timeframe filter in header</label>
       <pf-card head-title="Card Title" sub-title="Card Subtitle" show-top-border="true" filter="filterConfigHeader" style="width: 50%">
         Card Contents
       </pf-card>
     <label class="label-title">Footer with Link & Timeframe filter</label>
     <pf-card head-title="Card Title" sub-title="Card Subtitle" show-top-border="true"
          footer="footerConfig" filter="filterConfig" style="width: 50%">
        Card Contents
     </pf-card>
   </div>
 </file>
 <file name="script.js">
 angular.module( 'demo', ['patternfly.charts', 'patternfly.card'] ).controller( 'ChartCtrl', function( $scope ) {

       $scope.footerConfig = {
         'iconClass' : 'fa fa-flag',
         'text'      : 'View All Events',
         'callBackFn': function () {
            alert("Footer Callback Fn Called");
          }
       }

       $scope.filterConfigHeader = {
         'filters' : [{label:'Last 30 Days', value:'30'},
                      {label:'Last 15 Days', value:'15'},
                      {label:'Today', value:'today'}],
         'callBackFn': function (f) {
            alert("Header Filter Callback Fn Called for '" + f.label + "' value = " + f.value);
          },
        'position' : 'header'
       }

       $scope.filterConfig = {
         'filters' : [{label:'Last 30 Days', value:'30'},
                      {label:'Last 15 Days', value:'15'},
                      {label:'Today', value:'today'}],
         'callBackFn': function (f) {
            alert("Filter Callback Fn Called for '" + f.label + "' value = " + f.value);
          },
        'defaultFilter' : '1'
       }
     });
 </file>
 </example>
 */
;/**
 * @ngdoc directive
 * @name patternfly.card.component:pfCard - Trends
 * @restrict E
 *
 * @param {string} headTitle Title for the card
 * @param {string=} subTitle Sub-Title for the card
 * @param {boolean=} showTopBorder Show/Hide the blue top border. True shows top border, false (default) hides top border
 * @param {boolean=} showTitlesSeparator Show/Hide the grey line between the title and sub-title.
 * True (default) shows the line, false hides the line
 * @param {object=} footer footer configuration properties:<br/>
 * <ul style='list-style-type: none'>
 * <li>.iconClass  - (optional) the icon to show on the bottom left of the footer panel
 * <li>.text       - (optional) the text to show on the bottom left of the footer panel, to the right of the icon
 * <li>.href       - (optional) the href link to navigate to when the footer href is clicked
 * <li>.callBackFn - (optional) user defined function to call when the footer href is clicked
 * </ul>
 * *Note: If a href link and a callBackFn are specified, the href link will be called
 * @param {object=} filter filter configuration properties:<br/>
 * <ul style='list-style-type: none'>
 * <li>.filters    - drop down items for the filter.
 *<pre class=''>
 *  Ex:  'filters' : [{label:'Last 30 Days', value:'30'},
 *                    {label:'Last 15 Days', value:'15'},
 *                    {label:'Today', value:'today'}]</pre>
 * <li>.defaultFilter - integer, 0 based index into the filters array
 * <li>.callBackFn - user defined function to call when a filter is selected
 * </ul>
 * @description
 * Component for easily displaying a card with html content
 *
 * @example
 <example module="demo">

 <file name="index.html">
   <div ng-controller="ChartCtrl">
     <label class="label-title">Card With Single Trend</label>
     <pf-card head-title="Cluster Utilization" show-top-border="true" footer="footerConfig" filter="filterConfig" style="width: 50%">
       <pf-trends-chart config="configSingle" chart-data="dataSingle"></pf-trends-chart>
     </pf-card>
     <label class="label-title">Card with Multiple Trends</label>
     <pf-card head-title="Performance" sub-title="Last 30 Days" show-top-border="false"
          show-titles-separator="false" style="width: 65%" footer="actionBarConfig">
       <pf-trends-chart config="configVirtual" chart-data="dataVirtual"></pf-trends-chart>
       <pf-trends-chart config="configPhysical" chart-data="dataPhysical"></pf-trends-chart>
       <pf-trends-chart config="configMemory" chart-data="dataMemory"></pf-trends-chart>
     </pf-card>
    </div>
   </div>
 </file>
 <file name="script.js">
 angular.module( 'demo', ['patternfly.charts', 'patternfly.card'] ).controller( 'ChartCtrl', function( $scope ) {

       $scope.footerConfig = {
         'iconClass' : 'fa fa-flag',
         'text'      : 'View All Events',
         'callBackFn': function () {
            alert("Footer Callback Fn Called");
          }
       }

       $scope.filterConfig = {
         'filters' : [{label:'Last 30 Days', value:'30'},
                      {label:'Last 15 Days', value:'15'},
                      {label:'Today', value:'today'}],
         'callBackFn': function (f) {
            alert("Filter Callback Fn Called for '" + f.label + "' value = " + f.value);
          },
        'defaultFilter' : '1'
       }

       var today = new Date();
       var dates = ['dates'];
       for (var d = 20 - 1; d >= 0; d--) {
         dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
       }

       $scope.configSingle = {
         'chartId'      : 'example2TrendsChart',
         'title'        : 'Storage Capacity',
         'layout'       : 'compact',
         'valueType'    : 'actual',
         'units'        : 'TB',
         'tooltipType'  : 'percentage'
       };

       $scope.dataSingle = {
         'total': '250',
         'xData': dates,
         'yData': ['used', '90', '20', '30', '20', '20', '10', '14', '20', '25', '68', '44', '56', '78', '56', '67', '88', '76', '65', '87', '76']
       };

       $scope.configVirtual = {
         'chartId'      : 'virtualTrendsChart',
         'layout'       : 'inline',
         'trendLabel'   : 'Virtual Disk I/O',
         'units'        : 'GB',
         'tooltipType'  : 'percentage'
       };

       $scope.dataVirtual = {
         'total': '250',
         'xData': dates,
         'yData': ['used', '90', '20', '30', '20', '20', '10', '14', '20', '25', '68', '44', '56', '78', '56', '67', '88', '76', '65', '87', '76']
       };

       $scope.configPhysical = {
         'chartId'      : 'physicalTrendsChart',
         'layout'       : 'inline',
         'trendLabel'   : 'Physical Disk I/O',
         'units'        : 'MHz',
         'tooltipType'  : 'percentage'
       };

       $scope.dataPhysical = {
         'total': '250',
         'xData': dates,
         'yData': ['used', '20', '20', '35', '20', '20', '87', '14', '20', '25', '28', '44', '56', '78', '56', '67', '88', '76', '65', '87', '16']
       };

       $scope.configMemory = {
         'chartId'      : 'memoryTrendsChart',
         'layout'       : 'inline',
         'trendLabel'   : 'Memory Utilization',
         'units'        : 'GB',
         'tooltipType'  : 'percentage'
       };

       $scope.dataMemory = {
         'total': '250',
         'xData': dates,
         'yData': ['used', '20', '20', '35', '70', '20', '87', '14', '95', '25', '28', '44', '56', '66', '16', '67', '88', '76', '65', '87', '56']
       };

       $scope.actionBarConfig = {
         'iconClass' : 'fa fa-plus-circle',
         'text'      : 'Add New Cluster',
         'callBackFn': function () {
            alert("Footer Callback Fn Called");
          }
       }
     });
 </file>
 </example>
 */
;(function () {
  'use strict';

  var patternflyDefaults = patternfly.c3ChartDefaults();

  angular.module('patternfly.charts').constant('c3ChartDefaults', {
    getDefaultColors: patternflyDefaults.getDefaultColors,
    getDefaultDonut: patternflyDefaults.getDefaultDonut,
    getDefaultDonutSize: patternflyDefaults.getDefaultDonutSize,
    getDefaultDonutColor: patternflyDefaults.getDefaultDonutColors,
    getDefaultDonutLegend: patternflyDefaults.getDefaultDonutLegend,
    getDefaultDonutConfig: patternflyDefaults.getDefaultDonutConfig,
    getDefaultSparklineArea: patternflyDefaults.getDefaultSparklineArea,
    getDefaultSparklineSize: patternflyDefaults.getDefaultSparklineSize,
    getDefaultSparklineAxis: patternflyDefaults.getDefaultSparklineAxis,
    getDefaultSparklineColor: patternflyDefaults.getDefaultColors,
    getDefaultSparklineLegend: patternflyDefaults.getDefaultSparklineLegend,
    getDefaultSparklinePoint: patternflyDefaults.getDefaultSparklinePoint,
    getDefaultSparklineTooltip: patternflyDefaults.getDefaultSparklineTooltip,
    getDefaultSparklineConfig: patternflyDefaults.getDefaultSparklineConfig,
    getDefaultLineConfig: patternflyDefaults.getDefaultLineConfig
  });
})();
;/**
 * @ngdoc directive
 * @name patternfly.charts.component:pfC3Chart
 * @restrict E
 *
 * @description
 *   Component for wrapping c3 library
 *
 *   Note: The 'patternfly.charts' module is not a dependency in the default angular 'patternfly' module.
 *   In order to use patternfly charts you must add 'patternfly.charts' as a dependency in your application.
 *
 *
 * @param {string} id the ID of the container that the chart should bind to
 * @param {expression} config the c3 configuration options for the chart
 * @param {function (chart))=} getChartCallback the callback user function to be called once the chart is generated, containing the c3 chart object
 * @example

 <example module="patternfly.charts">
   <file name="index.html">
     <div ng-controller="ChartCtrl">
        <pf-c3-chart id="chartId" config="chartConfig" get-chart-callback="getChart"></pf-c3-chart>

        <form role="form" style="width:300px">
          Total = {{total}}, Used = {{used}}, Available = {{available}}
          <div class="form-group">
            <label>Used</label>
            <input type="text" class="form-control" ng-model="newUsed">
          </div>
          <input type="button" ng-click="submitform(newUsed)" value="Set Used" />
          <input type="button" ng-click="focusUsed()" value="Focus Used" />
        </form>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.charts' ).controller( 'ChartCtrl', function( $scope ) {
       $scope.used = 950;
       $scope.total = 1000;
       $scope.available =  $scope.total - $scope.used;

       $scope.chartConfig = patternfly.c3ChartDefaults().getDefaultDonutConfig('MHz Used');
       $scope.chartConfig.data = {
         type: "donut",
         columns: [
           ["Used", $scope.used],
           ["Available", $scope.total - $scope.used]
         ],
         groups: [
           ["used", "available"]
         ],
         order: null
       };

       $scope.getChart = function (chart) {
         $scope.chart = chart;
       }

       $scope.focusUsed = function () {
         $scope.chart.focus("Used");
       }

       $scope.updateAvailable = function (val) {
         $scope.available =  $scope.total - $scope.used;
       }

       $scope.submitform = function (val) {
         console.log("submitform");
         $scope.used = val;
         $scope.updateAvailable();
         $scope.chartConfig.data.columns = [["Used",$scope.used],["Available",$scope.available]];
       };
     });
   </file>
 </example>
 */
(function () {
  'use strict';

  angular.module('patternfly.charts').component('pfC3Chart', {
    bindings: {
      config: '<',
      getChartCallback: '<'
    },
    template: '<div id=""></div>',
    controller: ["$timeout", "$attrs", function ($timeout, $attrs) {
      var ctrl = this, prevConfig;

      // store the chart object
      var chart;
      ctrl.generateChart = function () {
        var chartData;

        // Need to deep watch changes in chart config
        prevConfig = angular.copy(ctrl.config);

        $timeout(function () {
          chartData = ctrl.config;
          if (chartData) {
            chartData.bindto = '#' + $attrs.id;
            // always re-generate donut pct chart because it's colors
            // change based on data and thresholds
            if (!chart || $attrs.id.indexOf('donutPctChart')) {
              chart = c3.generate(chartData);
            } else {
              //if chart is already created, then we only need to re-load data
              chart.load(ctrl.config.data);
            }
            if (ctrl.getChartCallback) {
              ctrl.getChartCallback(chart);
            }
            prevConfig = angular.copy(ctrl.config);
          }
        });
      };

      ctrl.$doCheck = function () {
        // do a deep compare on config
        if (!angular.equals(ctrl.config, prevConfig)) {
          ctrl.generateChart();
        }
      };
    }]
  });
}());
;angular.module('patternfly.charts').component('pfDonutChart', {
  bindings: {
    config: '<',
    data: '<',
    chartHeight: '<?'
  },
  templateUrl: 'charts/donut/donut-chart.html',
  controller: ["pfUtils", "$element", "$timeout", "$log", function (pfUtils, $element, $timeout, $log) {
    'use strict';
    var ctrl = this, prevData;

    ctrl.$onInit = function () {
      ctrl.donutChartId = 'donutChart';
      if (ctrl.config.chartId) {
        ctrl.donutChartId = ctrl.config.chartId + ctrl.donutChartId;
      }

      ctrl.updateAll();
    };

    ctrl.getDonutData = function () {
      return {
        type: 'donut',
        columns: ctrl.data,
        order: null,
        colors: ctrl.config.colors
      };
    };

    ctrl.updateAll = function () {
      // Need to deep watch changes in chart data
      prevData = angular.copy(ctrl.data);

      ctrl.config = pfUtils.merge(patternfly.c3ChartDefaults().getDefaultDonutConfig(), ctrl.config);
      ctrl.config.tooltip = { contents: patternfly.pfDonutTooltipContents };
      ctrl.config.data = ctrl.getDonutData();
      ctrl.config.data.onclick = ctrl.config.onClickFn;

    };

    ctrl.getTotal = function () {
      var total = 0;
      angular.forEach(ctrl.data, function (value) {
        angular.forEach(value, function (value) {
          if (!isNaN(value)) {
            total += Number(value);
          }
        });
      });
      return total;
    };

    ctrl.getCenterLabelText = function () {
      var centerLabelText;

      // default
      centerLabelText = { bigText: ctrl.getTotal(),
                          smText:  ctrl.config.donut.title};

      if (ctrl.config.centerLabelFn) {
        centerLabelText.bigText = ctrl.config.centerLabelFn();
        centerLabelText.smText = '';
      }

      return centerLabelText;
    };

    ctrl.setupDonutChartTitle = function () {
      var donutChartTitle, centerLabelText;

      if (angular.isUndefined(ctrl.chart)) {
        return;
      }

      donutChartTitle = d3.select(ctrl.chart.element).select('text.c3-chart-arcs-title');
      if (!donutChartTitle) {
        return;
      }

      centerLabelText = ctrl.getCenterLabelText();

      // Remove any existing title.
      donutChartTitle.text('');
      if (centerLabelText.bigText && !centerLabelText.smText) {
        donutChartTitle.text(centerLabelText.bigText);
      } else {
        donutChartTitle.insert('tspan').text(centerLabelText.bigText).classed('donut-title-big-pf', true).attr('dy', 0).attr('x', 0);
        donutChartTitle.insert('tspan').text(centerLabelText.smText).classed('donut-title-small-pf', true).attr('dy', 20).attr('x', 0);
      }
    };

    ctrl.setChart = function (chart) {
      ctrl.chart = chart;
      ctrl.setupDonutChartTitle();
    };

    ctrl.$onChanges = function (changesObj) {
      if (changesObj.config || changesObj.data) {
        ctrl.updateAll();
      }
      if (changesObj.chartHeight) {
        ctrl.config.size.height = changesObj.chartHeight.currentValue;
      }
    };

    ctrl.$doCheck = function () {
      // do a deep compare on data
      if (!angular.equals(ctrl.data, prevData)) {
        ctrl.updateAll();
      }
    };
  }]
});
;angular.module('patternfly.charts').component('pfDonutPctChart', {
  bindings: {
    config: '<',
    data: '<',
    chartHeight: '<?',
    centerLabel: '<?',
    onThresholdChange: '&'
  },
  templateUrl: 'charts/donut/donut-pct-chart.html',
  controller: ["pfUtils", "$element", "$timeout", function (pfUtils, $element, $timeout) {
    'use strict';
    var ctrl = this, prevData;

    ctrl.$onInit = function () {
      ctrl.donutChartId = 'donutPctChart';
      if (ctrl.config.chartId) {
        ctrl.donutChartId = ctrl.config.chartId + ctrl.donutChartId;
      }

      ctrl.updateAll();
    };

    ctrl.updateAvailable = function () {
      ctrl.data.available = ctrl.data.total - ctrl.data.used;
    };

    ctrl.getStatusColor = function (used, thresholds) {
      var threshold = "none";
      var color = pfUtils.colorPalette.blue;

      if (thresholds) {
        threshold = "ok";
        color = pfUtils.colorPalette.green;
        if (used >= thresholds.error) {
          threshold = "error";
          color = pfUtils.colorPalette.red;
        } else if (used >= thresholds.warning) {
          threshold = "warning";
          color = pfUtils.colorPalette.orange;
        }
      }

      if (!ctrl.threshold || ctrl.threshold !== threshold) {
        ctrl.threshold = threshold;
        ctrl.onThresholdChange({ threshold: ctrl.threshold });
      }

      return color;
    };

    ctrl.statusDonutColor = function () {
      var color, percentUsed;

      color = { pattern: [] };
      percentUsed = ctrl.data.used / ctrl.data.total * 100.0;
      color.pattern[0] = ctrl.getStatusColor(percentUsed, ctrl.config.thresholds);
      color.pattern[1] = pfUtils.colorPalette.black300;
      return color;
    };

    ctrl.donutTooltip = function () {
      return {
        contents: function (d) {
          var tooltipHtml;

          if (ctrl.config.tooltipFn) {
            tooltipHtml = '<span class="donut-tooltip-pf" style="white-space: nowrap;">' +
                              ctrl.config.tooltipFn(d) +
                         '</span>';
          } else {
            tooltipHtml = '<span class="donut-tooltip-pf" style="white-space: nowrap;">' +
                      Math.round(d[0].ratio * 100) + '%' + ' ' + ctrl.config.units + ' ' + d[0].name +
                   '</span>';
          }

          return tooltipHtml;
        }
      };
    };

    ctrl.getDonutData = function () {
      return {
        columns: [
          ['Used', ctrl.data.used],
          ['Available', ctrl.data.available]
        ],
        type: 'donut',
        donut: {
          label: {
            show: false
          }
        },
        groups: [
          ['used', 'available']
        ],
        order: null
      };
    };

    ctrl.getCenterLabelText = function () {
      var centerLabelText;

      // default to 'used' info.
      centerLabelText = { bigText: ctrl.data.used,
                          smText:  ctrl.config.units + ' Used' };

      if (ctrl.config.centerLabelFn) {
        centerLabelText.bigText = ctrl.config.centerLabelFn();
        centerLabelText.smText = '';
      } else if (ctrl.centerLabel === 'none') {
        centerLabelText.bigText = '';
        centerLabelText.smText = '';
      } else if (ctrl.centerLabel === 'available') {
        centerLabelText.bigText = ctrl.data.available;
        centerLabelText.smText = ctrl.config.units + ' Available';
      } else if (ctrl.centerLabel === 'percent') {
        centerLabelText.bigText = Math.round(ctrl.data.used / ctrl.data.total * 100.0) + '%';
        centerLabelText.smText = 'of ' + ctrl.data.total + ' ' + ctrl.config.units;
      }

      return centerLabelText;
    };

    ctrl.updateAll = function () {
      // Need to deep watch changes in chart data
      prevData = angular.copy(ctrl.data);

      ctrl.config = pfUtils.merge(patternfly.c3ChartDefaults().getDefaultDonutConfig(), ctrl.config);
      ctrl.updateAvailable();
      ctrl.config.data = pfUtils.merge(ctrl.config.data, ctrl.getDonutData());
      ctrl.config.color = ctrl.statusDonutColor(ctrl);
      ctrl.config.tooltip = ctrl.donutTooltip();
      ctrl.config.data.onclick = ctrl.config.onClickFn;
    };

    ctrl.setupDonutChartTitle = function () {
      var donutChartTitle, centerLabelText;

      if (angular.isUndefined(ctrl.chart)) {
        return;
      }

      donutChartTitle = d3.select(ctrl.chart.element).select('text.c3-chart-arcs-title');
      if (!donutChartTitle) {
        return;
      }

      centerLabelText = ctrl.getCenterLabelText();

      // Remove any existing title.
      donutChartTitle.selectAll('*').remove();
      if (centerLabelText.bigText && !centerLabelText.smText) {
        donutChartTitle.text(centerLabelText.bigText);
      } else {
        donutChartTitle.insert('tspan').text(centerLabelText.bigText).classed('donut-title-big-pf', true).attr('dy', 0).attr('x', 0);
        donutChartTitle.insert('tspan').text(centerLabelText.smText).classed('donut-title-small-pf', true).attr('dy', 20).attr('x', 0);
      }
    };

    ctrl.setChart = function (chart) {
      ctrl.chart = chart;
      ctrl.setupDonutChartTitle();
    };

    ctrl.$onChanges = function (changesObj) {
      if (changesObj.config || changesObj.data) {
        ctrl.updateAll();
      }
      if (changesObj.chartHeight) {
        ctrl.config.size.height = changesObj.chartHeight.currentValue;
      }
      if (changesObj.centerLabel) {
        ctrl.setupDonutChartTitle();
      }
    };

    ctrl.$doCheck = function () {
      // do a deep compare on data
      if (!angular.equals(ctrl.data, prevData)) {
        ctrl.updateAll();
      }
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.charts.component:pfDonutChart
 * @restrict E
 *
 * @description
 *   Component for rendering a donut chart which shows the relationships of a set of values to a whole.  When using a
 *   Donut Chart to show the relationship of a set of values to a whole, there should be no more than six
 *   categories.
 *
 *   <br><br>
 *   See http://c3js.org/reference.html for a full list of C3 chart options.
 *
 * @param {object} config configuration properties for the donut chart:<br/>
 * <ul style='list-style-type: none'>
 * <li>.chartId        - the unique id of the donut chart
 * <li>.centerLabelFn  - user defined function to customize the text of the center label (optional)
 * <li>.onClickFn(d,i) - user defined function to handle when donut arc is clicked upon.
 * </ul>
 *
 * @param {object} data an array of values for the donut chart.<br/>
 * <ul style='list-style-type: none'>
 * <li>.key           - string representing an arc within the donut chart
 * <li>.value         - number representing the value of the arc
 * </ul>
 *
 * @param {number} chartHeight height of the donut chart

 * @example
 <example module="patternfly.charts">
   <file name="index.html">
     <div ng-controller="ChartCtrl">
       <div class="container-fluid">
         <div class="row">
           <div class="col-md-6 text-center">
             <label>Donut Chart</label>
           </div>
           <div class="col-md-6 text-center">
             <label>Small Donut Chart</label>
           </div>
         </div>
       </div>
       <div class="row">
         <div class="col-md-6 text-center">
           <pf-donut-chart config="config" data="data"></pf-donut-chart>
         </div>
         <div class="col-md-6 text-center">
           <pf-donut-chart config="custConfig" data="data" chart-height="chartHeight"></pf-donut-chart>
         </div>
       </div>
      </div>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.charts' ).controller( 'ChartCtrl', function( $scope, $interval ) {
       $scope.config = {
         'chartId': 'chartOne',
         'legend': {"show":true},
         'colors' : {
           'Cats': '#0088ce',     // blue
           'Hamsters': '#3f9c35', // green
           'Fish': '#ec7a08',     // orange
           'Dogs': '#cc0000'      // red
         },
         donut: {
           title: "Animals"
         },
         'onClickFn': function (d, i) {
           alert("You clicked on donut arc: " + d.id);
          }
       };

       $scope.custConfig = angular.copy($scope.config);
       $scope.custConfig.chartId = 'chartTwo';
       $scope.custConfig.legend.position = 'right';
       $scope.custConfig.centerLabelFn = function () {
         return "Pets";
       };
       $scope.chartHeight = 120;

       $scope.data = [
         ['Cats', 2],
         ['Hamsters', 1],
         ['Fish', 3],
         ['Dogs', 2]
       ];


     });
   </file>
 </example>
 */
;/**
 * @ngdoc directive
 * @name patternfly.charts.component:pfDonutPctChart
 * @restrict E
 *
 * @description
 *   Component for rendering a percentage used donut/radial chart.  The Used Percentage fill starts at 12 o’clock and
 *   moves clockwise.  Whatever portion of the donut not Used, will be represented as Available, and rendered as a
 *   gray fill.
 *   There are three possible fill colors for Used Percentage, dependent on whether or not there are thresholds:<br/>
 *   <ul>
 *   <li>When no thresholds exist, or if the used percentage has not surpassed any thresholds, the indicator is blue.
 *   <li>When the used percentage has surpassed the warning threshold, but not the error threshold, the indicator is orange.
 *   <li>When the used percentage has surpassed the error threshold, the indicator is is red.
 *   </ul>
 *   The directive will calculate the Available Percentage (Total - Used), and display it as a grey radial fill.
 *
 *   <br><br>
 *   See http://c3js.org/reference.html for a full list of C3 chart options.
 *
 * @param {object} config configuration properties for the donut chart:<br/>
 * <ul style='list-style-type: none'>
 * <li>.chartId        - the unique id of the donut chart
 * <li>.units          - unit label for values, ex: 'MHz','GB', etc..
 * <li>.thresholds     - warning and error percentage thresholds used to determine the Usage Percentage fill color (optional)
 * <li>.tooltipFn(d)   - user defined function to customize the tool tip (optional)
 * <li>.centerLabelFn  - user defined function to customize the text of the center label (optional)
 * <li>.onClickFn(d,i) - user defined function to handle when donut arc is clicked upon.
 * </ul>
 *
 * @param {object} data the Total and Used values for the donut chart.  Available is calculated as Total - Used.<br/>
 * <ul style='list-style-type: none'>
 * <li>.used          - number representing the amount used
 * <li>.total         - number representing the total amount
 * <li>.dataAvailable - Flag if there is data available - default: true
 * </ul>
 *
 * @param {string=} center-label specifies the contents of the donut's center label.<br/>
 * <strong>Values:</strong>
 * <ul style='list-style-type: none'>
 * <li> 'used'      - displays the Used amount in the center label (default)
 * <li> 'available' - displays the Available amount in the center label
 * <li> 'percent'   - displays the Usage Percent of the Total amount in the center label
 * <li> 'none'      - does not display the center label
 * </ul>
 *
 * @param {int=} chartHeight height of the donut chart
 * @param {function (threshold)} on-threshold-change user defined function to handle when thresolds change <br/>
 * <strong>'threshold' Values:</strong>
 * <ul style='list-style-type: none'>
 * <li> 'ok'      - when ok threshold is set
 * <li> 'warning' - when warning threshold is set
 * <li> 'error'   - when error threshold is set
 * </ul>


 * @example
 <example module="patternfly.charts">
   <file name="index.html">
     <div ng-controller="ChartCtrl">
       <div class="container-fluid">
         <div class="row">
           <div class="col-md-3 text-center">
             <label>Error Threshold</label>
             <pf-donut-pct-chart config="configErr" data="dataErr" chart="chartErr"></pf-donut-pct-chart>
           </div>
           <div class="col-md-3 text-center"">
             <label>Warning Threshold</label>
             <pf-donut-pct-chart config="configWarn" data="dataWarn"></pf-donut-pct-chart>
           </div>
           <div class="col-md-3 text-center"">
             <label class="camelcase">{{threshLabel}} Threshold</label>
             <pf-donut-pct-chart config="configDynamic" data="dataDynamic" center-label="labelDynamic"
                                 on-threshold-change="thresholdChanged(threshold)">
             </pf-donut-pct-chart>
           </div>
           <div class="col-md-3 text-center"">
             <label>No Threshold</label>
             <pf-donut-pct-chart config="configNoThresh" data="dataNoThresh"></pf-donut-pct-chart>
           </div>
         </div>

         <div class="row">
           <div class="col-md-12">
             <hr>
           </div>
         </div>

         <div class="row">
           <div class="col-md-3 text-center">
             <pf-donut-pct-chart config="usedConfig" data="usedData" center-label="usedLabel"></pf-donut-pct-chart>
             <label>center-label = 'used'</label>
           </div>
           <div class="col-md-3 text-center">
             <pf-donut-pct-chart config="availConfig" data="availData" center-label="availLabel"></pf-donut-pct-chart>
             <label>center-label = 'available'</label>
           </div>
           <div class="col-md-3 text-center">
             <pf-donut-pct-chart config="pctConfig" data="pctData" center-label="pctLabel"></pf-donut-pct-chart>
             <label>center-label = 'percent'</label>
           </div>
           <div class="col-md-3 text-center">
             <pf-donut-pct-chart config="noneConfig" data="noneData" center-label="noLabel"></pf-donut-pct-chart>
             <label>center-label = ' none'</label>
           </div>
         </div>

         <div class="row">
           <div class="col-md-12">
             <hr>
           </div>
         </div>

         <div class="row">
           <div class="col-md-12 text-center">
             <label>Custom Tooltip, Legend, Click handling, and Center Label</label><br>
             <label><strong>Click on Donut Arc!</strong></label>
             <pf-donut-pct-chart config="custConfig" chart-height="custChartHeight" data="custData"></pf-donut-pct-chart>
           </div>
         </div>
         <div class="row">
           <div class="col-md-3">
             <form role="form"">
               <div class="form-group">
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custData.dataAvailable">Data Available</input>
                 </label>
               </div>
             </form>
           </div>
           <div class="col-md-3">
             <form role="form" >
               <div class="form-group">
                 <label>Chart Height</label>
                 </br>
                 <input style="height:25px; width:60px;" type="number" ng-model="custChartHeight"/>
               </div>
             </form>
           </div>
         </div>
       </div>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.charts' ).controller( 'ChartCtrl', function( $scope, $interval ) {
       $scope.configErr = {
         'chartId': 'chartErr',
         'units': 'GB',
         'thresholds':{'warning':'60','error':'90'}
       };

       $scope.dataErr = {
         'used': '950',
         'total': '1000'
       };

       $scope.ChartErr = {};

       $scope.configWarn = {
         'chartId': 'chartWarn',
         'units': 'GB',
         'thresholds':{'warning':'60','error':'90'}
       };

       $scope.dataWarn = {
         'used': '650',
         'total': '1000'
       };

       $scope.configDynamic = {
         'chartId': 'chartOk',
         'units': 'GB',
         'thresholds':{'warning':'60','error':'90'}
       };

       $scope.dataDynamic = {
         'used': '550',
         'total': '1000'
       };

       $scope.labelDynamic = "used";

       $scope.thresholdChanged = function(threshold) {
          $scope.threshLabel = threshold;
       };

       $interval(function () {
         $scope.dataDynamic.used = Number($scope.dataDynamic.used) + 40;
         if ($scope.dataDynamic.used > 1000) {
           $scope.dataDynamic.used = 10;
         }

         if ($scope.dataDynamic.used < 500) {
           $scope.labelDynamic = "used";
         } else {
           $scope.labelDynamic = "percent";
         }
       }, 1000);

       $scope.configNoThresh = {
         'chartId': 'chartNoThresh',
         'units': 'GB',
       };

       $scope.dataNoThresh = {
         'used': '750',
         'total': '1000'
       };

       $scope.usedConfig = {
         'chartId': 'usedChart',
         'units': 'GB',
         'thresholds':{'warning':'60','error':'90'}
       };

       $scope.usedData = {
         'used': '350',
         'total': '1000'
       };

       $scope.usedLabel = "used";

       $scope.availConfig = {
         'chartId': 'availChart',
         'units': 'GB',
         'thresholds':{'warning':'60','error':'90'}
       };

       $scope.availData = {
          'used': '350',
          'total': '1000'
        };

       $scope.availLabel = "available";

       $scope.pctConfig = {
         'chartId': 'pctChart',
         'units': 'GB',
         'thresholds':{'warning':'60','error':'90'}
       };

       $scope.pctData = {
         'used': '350',
         'total': '1000'
       };

       $scope.pctLabel = "percent";

       $scope.noneConfig = {
         'chartId': 'noneChart',
         'units': 'GB',
         'thresholds':{'warning':'60','error':'90'}
       };

       $scope.noneData = {
         'used': '350',
         'total': '1000'
       };

       $scope.noLabel = "none";

       $scope.custConfig = {
         'chartId': 'custChart',
         'units': 'MHz',
         'thresholds':{'warning':'60','error':'90'},
         "legend":{"show":true},
         'tooltipFn': function (d) {
           return '<span class="donut-tooltip-pf"style="white-space: nowrap;">' +
                    d[0].value + ' ' + d[0].name +
                  '</span>';
           },
         'centerLabelFn': function () {
           return $scope.custData.available + " GB";
           },
         'onClickFn': function (d, i) {
           alert("You Clicked On The Donut!");
           }
         };

       $scope.custData = {
         'dataAvailable': true,
         'used': '670',
         'total': '1000'
       };

       $scope.custChartHeight = 200;
     });
   </file>
 </example>
 */
;/**
 *
 * @description
 *   Directive for rendering an empty chart. This is used by chart directives when the data
 *   available flag is set to false.
 *
 * @param {string=} chartHeight height of the chart (no units) - default: 40
 */
angular.module('patternfly.charts').component('pfEmptyChart', {
  bindings: {
    chartHeight: '<?'
  },
  templateUrl: 'charts/empty-chart.html',
  controller: function () {
    'use strict';
    var ctrl = this;

    ctrl.setSizeStyles = function () {
      var height = ctrl.chartHeight || 40;
      var topPadding = Math.min(Math.round((height - 40) / 2), 20);
      ctrl.sizeStyles = {
        height: height + 'px',
        'padding-top': topPadding + 'px'
      };
    };
    ctrl.setSizeStyles();

    ctrl.$onChanges =  function (changesObj) {
      if (changesObj.chartHeight) {
        ctrl.setSizeStyles();
      }
    };
  }
});
;angular.module('patternfly.charts').component('pfHeatmapLegend', {
  bindings: {
    legend: '<?',
    legendColors: '<?'
  },
  templateUrl: 'charts/heatmap/heatmap-legend.html',
  controller: function () {
    'use strict';
    var ctrl = this;

    var heatmapColorPatternDefaults = ['#d4f0fa', '#F9D67A', '#EC7A08', '#CE0000'];
    var legendLabelDefaults = ['< 70%', '70-80%', '80-90%', '> 90%'];

    ctrl.$onInit = function () {
      ctrl.updateAll();
    };

    ctrl.updateAll = function () {
      var items = [];
      var index;

      //Allow overriding of defaults
      if (!ctrl.legendColors) {
        ctrl.legendColors = heatmapColorPatternDefaults;
      }
      if (!ctrl.legend) {
        ctrl.legend = legendLabelDefaults;
      }
      for (index = ctrl.legend.length - 1; index >= 0; index--) {
        items.push({
          text: ctrl.legend[index],
          color: ctrl.legendColors[index]
        });
      }
      ctrl.legendItems = items;
    };

    ctrl.$onChanges = function (changesObj) {
      if (changesObj.legend && !changesObj.legend.isFirstChange()) {
        ctrl.updateAll();
      }
      if (changesObj.legendColors && !changesObj.legendColors.isFirstChange()) {
        ctrl.updateAll();
      }
    };
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.charts.directive:pfHeatMap
 * @restrict E
 *
 * @description
 *   Component for rendering a heatmap chart.
 *
 * @param {object} data data for the chart:<br/>
 * <ul style='list-style-type: none'>
 * <li>.id            - the id of the measurement
 * <li>.value         - the value of the measurement
 * <li>.tooltip       - message to be displayed on hover
 * </ul>
 *
 * @param {boolean=} chartDataAvailable flag if the chart data is available - default: true
 * @param {number=} height height of the chart (no units) - default: 200
 * @param {string=} chartTitle title of the chart
 * @param {boolean=} showLegend flag to show the legend, defaults to true
 * @param {array=} legendLabels the labels for the legend - defaults: ['< 70%', '70-80%' ,'80-90%', '> 90%']
 * @param {number=} maxBlockSize the maximum size for blocks in the heatmap. Default: 50, Range: 5 - 50
 * @param {number=} minBlockSize the minimum size for blocks in the heatmap. Default: 2
 * @param {number=} blockPadding the padding in pixels between blocks (default: 2)
 * @param {array=} thresholds the threshold values for the heapmap - defaults: [0.7, 0.8, 0.9]
 * @param {array=} heatmapColorPattern the colors that correspond to the various threshold values (lowest to hightest value ex: <70& to >90%) - defaults: ['#d4f0fa', '#F9D67A', '#EC7A08', '#CE0000']
 * @param {function=} clickAction function(block) function to call when a block is clicked on
 * @param {number=} rangeHoverSize the maximum size for highlighting blocks in the same range. Default: 15
 * @param {boolean=} rangeOnHover flag to highlight blocks in the same range on hover, defaults to true
 * @param {array=} rangeTooltips the tooltips for blocks in the same range - defaults: ['< 70%', '70-80%' ,'80-90%', '> 90%']
 * @example
 <example module="patternfly.charts">
   <file name="index.html">
     <div ng-controller="ChartCtrl">
       <div class="row">
         <div class="col-md-5 example-heatmap-container">
           <pf-heatmap id="id" chart-title="title" data="data" chart-data-available="dataAvailable"
                show-legend="showLegends"></pf-heatmap>
         </div>
         <div class="col-md-3 example-heatmap-container">
           <pf-heatmap id="id" chart-title="titleAlt" data="data" chart-data-available="dataAvailable"
                show-legend="showLegends" legend-labels="legendLabels"  max-block-size="20" block-padding="5"
                heatmap-color-pattern="heatmapColorPattern" thresholds="thresholds"
                click-action="clickAction"></pf-heatmap>
         </div>
         <div class="col-md-3 example-heatmap-container">
           <pf-heatmap id="id" chart-title="titleSmall" data="data" chart-data-available="dataAvailable"
                show-legend="showLegends" max-block-size="15" range-tooltips="rangeTooltips"></pf-heatmap>
           </div>
       </div>
       <div class="row">
         <div class="col-md-3">
           <form role="form">
             <div class="form-group">
               <label class="checkbox-inline">
                 <input type="checkbox" ng-model="dataAvailable">Data Available</input>
               </label>
             </div>
           </form>
         </div>
         <div class="col-md-3">
           <form role="form">
             <div class="form-group">
               <label class="checkbox-inline">
                 <input type="checkbox" ng-model="showLegends">Show Legends</input>
               </label>
             </div>
           </form>
         </div>
       </div>
     </div>
   </file>
   <file name="script.js">
     angular.module( 'patternfly.charts' ).controller( 'ChartCtrl', function( $scope) {
       $scope.data = [
       {'id': 9,'value': 0.96,'tooltip': 'Node 8 : My OpenShift Provider<br\>96% : 96 Used of 100 Total<br\>4 Available'},
       {'id': 44, 'value': 0.94, 'tooltip': 'Node 19 : My Kubernetes Provider<br\>94% : 94 Used of 100 Total<br\>6 Available'},
       {'id': 0, 'value': 0.91, 'tooltip': 'Node 9 : My OpenShift Provider<br\>91% : 91 Used of 100 Total<br\>9 Available'},
       {'id': 43, 'value': 0.9, 'tooltip': 'Node 18 : My Kubernetes Provider<br\>90% : 90 Used of 100 Total<br\>10 Available'},
       {'id': 7, 'value': 0.89, 'tooltip': 'Node 12 : My OpenShift Provider<br\>89% : 89 Used of 100 Total<br\>11 Available'},
       {'id': 41, 'value': 0.82, 'tooltip': 'Node 16 : My Kubernetes Provider<br\>82% : 82 Used of 100 Total<br\>18 Available'},
       {'id': 21, 'value': 0.81, 'tooltip': 'Node 21 : My OpenShift Provider<br\>81% : 81 Used of 100 Total<br\>19 Available'},
       {'id': 26, 'value': 0.8, 'tooltip': 'Node 1 : My Kubernetes Provider<br\>80% : 80 Used of 100 Total<br\>20 Available'},
       {'id': 48, 'value': 0.74, 'tooltip': 'Node 23 : My Kubernetes Provider<br\>74% : 74 Used of 100 Total<br\>26 Available'},
       {'id': 27, 'value': 0.72, 'tooltip': 'Node 2 : My Kubernetes Provider<br\>72% : 72 Used of 100 Total<br\>28 Available'},
       {'id': 42, 'value': 0.71, 'tooltip': 'Node 17 : My Kubernetes Provider<br\>71% : 71 Used of 100 Total<br\>29 Available'},
       {'id': 23, 'value': 0.71, 'tooltip': 'Node 23 : My OpenShift Provider<br\>71% : 71 Used of 100 Total<br\>29 Available'},
       {'id': 22, 'value': 0.69, 'tooltip': 'Node 22 : My OpenShift Provider<br\>69% : 69 Used of 100 Total<br\>31 Available'},
       {'id': 2, 'value': 0.66, 'tooltip': 'Node 2 : M8y OpenShift Provider<br\>66% : 66 Used of 100 Total<br\>34 Available'},
       {'id': 39, 'value': 0.66, 'tooltip': 'Node 14 : My Kubernetes Provider<br\>66% : 66 Used of 100 Total<br\>34 Available'},
       {'id': 3, 'value': 0.65, 'tooltip': 'Node 39 : My OpenShift Provider<br\>65% : 65 Used of 100 Total<br\>35 Available'},
       {'id': 29, 'value': 0.65, 'tooltip': 'Node 4 : My Kubernetes Provider<br\>65% : 65 Used of 100 Total<br\>35 Available'},
       {'id': 32, 'value': 0.56, 'tooltip': 'Node 7 : My Kubernetes Provider<br\>56% : 56 Used of 100 Total<br\>44 Available'},
       {'id': 13, 'value': 0.56, 'tooltip': 'Node 13 : My OpenShift Provider<br\>56% : 56 Used of 100 Total<br\>44 Available'},
       {'id': 49, 'value': 0.52, 'tooltip': 'Node 24 : My Kubernetes Provider<br\>52% : 52 Used of 100 Total<br\>48 Available'},
       {'id': 36, 'value': 0.5, 'tooltip': 'Node 11 : My Kubernetes Provider<br\>50% : 50 Used of 100 Total<br\>50 Available'},
       {'id': 6, 'value': 0.5, 'tooltip': 'Node 5 : My OpenShift Provider<br\>50% : 50 Used of 100 Total<br\>50 Available'},
       {'id': 38, 'value': 0.49, 'tooltip': 'Node 13 : My Kubernetes Provider<br\>49% : 49 Used of 100 Total<br\>51 Available'},
       {'id': 15, 'value': 0.48, 'tooltip': 'Node 15 : My OpenShift Provider<br\>48% : 48 Used of 100 Total<br\>52 Available'},
       {'id': 30, 'value': 0.48, 'tooltip': 'Node 5 : My Kubernetes Provider<br\>48% : 48 Used of 100 Total<br\>52 Available'},
       {'id': 11, 'value': 0.47, 'tooltip': 'Node 11 : My OpenShift Provider<br\>47% : 47 Used of 100 Total<br\>53 Available'},
       {'id': 17, 'value': 0.46, 'tooltip': 'Node 17 : My OpenShift Provider<br\>46% : 46 Used of 100 Total<br\>54 Available'},
       {'id': 25, 'value': 0.45, 'tooltip': 'Node 0 : My Kubernetes Provider<br\>45% : 45 Used of 100 Total<br\>55 Available'},
       {'id': 50, 'value': 0.45, 'tooltip': 'Node 25 : My Kubernetes Provider<br\>45% : 45 Used of 100 Total<br\>55 Available'},
       {'id': 46, 'value': 0.45, 'tooltip': 'Node 21 : My Kubernetes Provider<br\>45% : 45 Used of 100 Total<br\>55 Available'},
       {'id': 47, 'value': 0.45, 'tooltip': 'Node 22 : My Kubernetes Provider<br\>45% : 45 Used of 100 Total<br\>55 Available'},
       {'id': 1, 'value': 0.44, 'tooltip': 'Node 1 : My OpenShift Provider<br\>44% : 44 Used of 100 Total<br\>56 Available'},
       {'id': 31, 'value': 0.44, 'tooltip': 'Node 6 : My Kubernetes Provider<br\>44% : 44 Used of 100 Total<br\>56 Available'},
       {'id': 37, 'value': 0.44, 'tooltip': 'Node 12 : My Kubernetes Provider<br\>44% : 44 Used of 100 Total<br\>56 Available'},
       {'id': 24, 'value': 0.44, 'tooltip': 'Node 24 : My OpenShift Provider<br\>44% : 44 Used of 100 Total<br\>56 Available'},
       {'id': 40, 'value': 0.43, 'tooltip': 'Node 40 : My Kubernetes Provider<br\>43% : 43 Used of 100 Total<br\>57 Available'},
       {'id': 20, 'value': 0.39, 'tooltip': 'Node 20 : My OpenShift Provider<br\>39% : 39 Used of 100 Total<br\>61 Available'},
       {'id': 8, 'value': 0.39, 'tooltip': 'Node 8 : My OpenShift Provider<br\>39% : 39 Used of 100 Total<br\>61 Available'},
       {'id': 5, 'value': 0.38, 'tooltip': 'Node 5 : My OpenShift Provider<br\>38% : 38 Used of 100 Total<br\>62 Available'},
       {'id': 45, 'value': 0.37, 'tooltip': 'Node 20 : My Kubernetes Provider<br\>37% : 37 Used of 100 Total<br\>63 Available'},
       {'id': 12, 'value': 0.37, 'tooltip': 'Node 12 : My OpenShift Provider<br\>37% : 37 Used of 100 Total<br\>63 Available'},
       {'id': 34, 'value': 0.37, 'tooltip': 'Node 9 : My Kubernetes Provider<br\>37% : 37 Used of 100 Total<br\>63 Available'},
       {'id': 33, 'value': 0.33, 'tooltip': 'Node 8 : My Kubernetes Provider<br\>33% : 33 Used of 100 Total<br\>67 Available'},
       {'id': 16, 'value': 0.32, 'tooltip': 'Node 16 : My OpenShift Provider<br\>32% : 32 Used of 100 Total<br\>68 Available'},
       {'id': 10, 'value': 0.29, 'tooltip': 'Node 10 : My OpenShift Provider<br\>28% : 29 Used of 100 Total<br\>71 Available'},
       {'id': 35, 'value': 0.28, 'tooltip': 'Node 35 : My Kubernetes Provider<br\>28% : 28 Used of 100 Total<br\>72 Available'},
       {'id': 18, 'value': 0.27, 'tooltip': 'Node 18 : My OpenShift Provider<br\>27% : 27 Used of 100 Total<br\>73 Available'},
       {'id': 4, 'value': 0.26, 'tooltip': 'Node 4 : My OpenShift Provider<br\>26% : 26 Used of 100 Total<br\>74 Available'},
       {'id': 19, 'value': 0.25, 'tooltip': 'Node 19 : My OpenShift Provider<br\>25% : 25 Used of 100 Total<br\>75 Available'},
       {'id': 28, 'value': 0.25, 'tooltip': 'Node 3 : My Kubernetes Provider<br\>25% : 25 Used of 100 Total<br\>75 Available'},
       {'id': 51, 'value': 0.22, 'tooltip': 'Node 26 : My Kubernetes Provider<br\>22% : 22 Used of 100 Total<br\>78 Available'},
       {'id': 14, 'value': 0.2, 'tooltip': 'Node 14 : My OpenShift Provider<br\>20% : 20 Used of 100 Total<br\>80 Available'}];

       $scope.dataAvailable = true;
       $scope.title = 'Utilization - Using Defaults';
       $scope.titleAlt = 'Utilization - Overriding Defaults';
       $scope.titleSmall = 'Utilization - Small Blocks';
       $scope.legendLabels = ['< 60%','70%', '70-80%' ,'80-90%', '> 90%'];
       $scope.rangeTooltips = ['Memory Utilization < 70%<br\>40 Nodes', 'Memory Utilization 70-80%<br\>4 Nodes', 'Memory Utilization 80-90%<br\>4 Nodes', 'Memory Utilization > 90%<br\>4 Nodes'];
       $scope.thresholds = [0.6, 0.7, 0.8, 0.9];
       $scope.heatmapColorPattern = ['#d4f0fa', '#F9D67A', '#EC7A08', '#CE0000', '#f00'];

       $scope.showLegends = true;
       var clickAction = function (block) {
          console.log(block);
       };
       $scope.clickAction = clickAction;
     });
   </file>
 </example>
 */
angular.module('patternfly.charts').component('pfHeatmap', {
  bindings: {
    data: '<',
    chartDataAvailable: '<?',
    height: '<?',
    chartTitle: '<?',
    showLegend: '<?',
    legendLabels: '<?',
    maxBlockSize: '@',
    minBlockSize: '@',
    blockPadding: '@',
    thresholds: '<?',
    heatmapColorPattern: '<?',
    clickAction: '<?',
    rangeOnHover: '<?',
    rangeHoverSize: '@',
    rangeTooltips: '<?'
  },
  templateUrl: 'charts/heatmap/heatmap.html',
  controller: ["$element", "$window", "$compile", "$scope", "$timeout", function ($element, $window, $compile, $scope, $timeout) {
    'use strict';
    var ctrl = this, prevData;

    var containerWidth, containerHeight, blockSize, numberOfRows;

    var thresholdDefaults = [0.7, 0.8, 0.9];
    var heatmapColorPatternDefaults = ['#d4f0fa', '#F9D67A', '#EC7A08', '#CE0000'];
    var legendLabelDefaults = ['< 70%', '70-80%' ,'80-90%', '> 90%'];
    var rangeTooltipDefaults = ['< 70%', '70-80%' ,'80-90%', '> 90%'];
    var heightDefault = 200;

    var setStyles = function () {
      ctrl.containerStyles = {
        height: ctrl.height + 'px',
        display: ctrl.chartDataAvailable === false ? 'none' : 'block'
      };
    };

    var setSizes = function () {
      var parentContainer = $element[0].querySelector('.heatmap-container');
      containerWidth = parentContainer.clientWidth;
      containerHeight = parentContainer.clientHeight;
      blockSize = determineBlockSize();

      if ((blockSize - ctrl.padding) > ctrl.maxSize) {
        blockSize = ctrl.padding + ctrl.maxSize;

        // Attempt to square off the area, check if square fits
        numberOfRows = Math.ceil(Math.sqrt(ctrl.data.length));
        if (blockSize * numberOfRows > containerWidth ||
          blockSize * numberOfRows > containerHeight) {
          numberOfRows = (blockSize === 0) ? 0 : Math.floor(containerHeight / blockSize);
        }
      } else if ((blockSize - ctrl.padding) < ctrl.minSize) {
        blockSize = ctrl.padding + ctrl.minSize;

        // Attempt to square off the area, check if square fits
        numberOfRows = Math.ceil(Math.sqrt(ctrl.data.length));
        if (blockSize * numberOfRows > containerWidth ||
          blockSize * numberOfRows > containerHeight) {
          numberOfRows = (blockSize === 0) ? 0 : Math.floor(containerHeight / blockSize);
        }
      } else {
        numberOfRows = (blockSize === 0) ? 0 : Math.floor(containerHeight / blockSize);
      }
    };

    var determineBlockSize = function () {
      var x = containerWidth;
      var y = containerHeight;
      var n = ctrl.data ? ctrl.data.length : 0;
      var px = Math.ceil(Math.sqrt(n * x / y));
      var py = Math.ceil(Math.sqrt(n * y / x));
      var sx, sy;

      if (Math.floor(px * y / x) * px < n) {
        sx = y / Math.ceil(px * y / x);
      } else {
        sx = x / px;
      }

      if (Math.floor(py * x / y) * py < n) {
        sy = x / Math.ceil(x * py / y);
      } else {
        sy = y / py;
      }
      return Math.max(sx, sy);
    };

    var redraw = function () {
      var data = ctrl.data;
      var color = d3.scale.threshold().domain(ctrl.thresholds).range(ctrl.heatmapColorPattern);
      var rangeTooltip = d3.scale.threshold().domain(ctrl.thresholds).range(ctrl.rangeTooltips);
      var blocks;
      var fillSize = blockSize - ctrl.padding;
      var highlightBlock = function (block, active) {
        block.style('fill-opacity', active ? 1 : 0.4);
      };
      var highlightBlockColor = function (block, fillColor) {
        // Get fill color from given block
        var blockColor = color(block.map(function (d) {
          return d[0].__data__.value;
        }));
        // If given color matches, apply highlight
        if (blockColor === fillColor) {
          block.style('fill-opacity', 1);
        }
      };

      var svg = window.d3.select(ctrl.thisComponent);
      svg.selectAll('*').remove();
      blocks = svg.selectAll('rect').data(data).enter().append('rect');
      blocks.attr('x', function (d, i) {
        return Math.floor(i / numberOfRows) * blockSize;
      }).attr('y', function (d, i) {
        return i % numberOfRows * blockSize;
      }).attr('width', fillSize).attr('height', fillSize).style('fill', function (d) {
        return color(d.value);
      }).attr('uib-tooltip-html', function (d, i) { //tooltip-html is throwing an exception
        if (ctrl.rangeOnHover && fillSize <= ctrl.rangeHoverSize) {
          return '"' + rangeTooltip(d.value) + '"';
        }
        return "'" + d.tooltip + "'";
      }).attr('tooltip-append-to-body', function (d, i) {
        return true;
      }).attr('tooltip-animation', function (d, i) {
        return false;
      });

      //Adding events
      blocks.on('mouseover', function () {
        var fillColor;
        blocks.call(highlightBlock, false);
        if (ctrl.rangeOnHover && fillSize <= ctrl.rangeHoverSize) {
          // Get fill color for current block
          fillColor = color(d3.select(this).map(function (d) {
            return d[0].__data__.value;
          }));
          // Highlight all blocks matching fill color
          blocks[0].forEach(function (block) {
            highlightBlockColor(d3.select(block), fillColor);
          });
        } else {
          d3.select(this).call(highlightBlock, true);
        }
      });
      blocks.on('click', function (d) {
        if (ctrl.clickAction) {
          ctrl.clickAction(d);
        }
      });

      //Compiles the tooltips
      angular.forEach(angular.element(blocks), function (block) {
        var el = angular.element(block);
        // TODO: get heatmap tooltips to work without using $compile or $scope
        $compile(el)($scope);
      });

      svg.on('mouseleave', function () {
        blocks.call(highlightBlock, true);
      });
    };

    ctrl.updateAll = function () {
      // Need to deep watch changes in chart data
      prevData = angular.copy(ctrl.data);

      //Allow overriding of defaults
      if (ctrl.maxBlockSize === undefined || isNaN(ctrl.maxBlockSize)) {
        ctrl.maxSize = 64;
      } else {
        ctrl.maxSize = parseInt(ctrl.maxBlockSize);
        if (ctrl.maxSize < 5) {
          ctrl.maxSize = 5;
        } else if (ctrl.maxSize > 50) {
          ctrl.maxSize = 50;
        }
      }

      if (ctrl.minBlockSize === undefined || isNaN(ctrl.minBlockSize)) {
        ctrl.minSize = 2;
      } else {
        ctrl.minSize = parseInt(ctrl.minBlockSize);
      }

      if (ctrl.blockPadding === undefined || isNaN(ctrl.blockPadding)) {
        ctrl.padding = 2;
      } else {
        ctrl.padding = parseInt(ctrl.blockPadding);
      }

      if (ctrl.rangeHoverSize === undefined || isNaN(ctrl.rangeHoverSize)) {
        ctrl.rangeHoverSize = 15;
      } else {
        ctrl.rangeHoverSize = parseInt(ctrl.rangeHoverSize);
      }

      ctrl.rangeOnHover = (ctrl.rangeOnHover === undefined || ctrl.rangeOnHover) ? true : false;

      if (!ctrl.rangeTooltips) {
        ctrl.rangeTooltips = rangeTooltipDefaults;
      }

      if (!ctrl.thresholds) {
        ctrl.thresholds = thresholdDefaults;
      }

      if (!ctrl.heatmapColorPattern) {
        ctrl.heatmapColorPattern = heatmapColorPatternDefaults;
      }

      if (!ctrl.legendLabels) {
        ctrl.legendLabels = legendLabelDefaults;
      }
      ctrl.height = ctrl.height || heightDefault;
      ctrl.showLegend = ctrl.showLegend || (ctrl.showLegend === undefined);
      ctrl.loadingDone = false;

      angular.element($window).on('resize', function () {
        setSizes();
        redraw();
      });

      ctrl.thisComponent = $element[0].querySelector('.heatmap-pf-svg');

      $timeout(function () {
        setStyles();
        setSizes();
        redraw();
      });
    };

    ctrl.$onChanges = function (changesObj) {
      if (changesObj.chartDataAvailable && !changesObj.chartDataAvailable.isFirstChange()) {
        setStyles();
      } else {
        ctrl.updateAll();
        ctrl.loadingDone = true;
      }
    };

    ctrl.$doCheck = function () {
      // do a deep compare on chartData and config
      if (!angular.equals(ctrl.data, prevData)) {
        setStyles();
        if (ctrl.chartDataAvailable !== false) {
          setSizes();
          redraw();
        }
      }
    };

    ctrl.$postLink = function () {
      setStyles();
      setSizes();
      redraw();
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.charts.component:pfLineChart
 * @restrict E
 *
 * @description
 *   Component for rendering a line chart.
 *   <br><br>
 *   See http://c3js.org/reference.html for a full list of C3 chart options.
 *
 * @param {object} config configuration settings for the line chart:<br/>
 * <ul style='list-style-type: none'>
 * <li>.chartId            - the ID of the container that the chart should bind to
 * <li>.units              - unit label for values, ex: 'MHz','GB', etc..
 * <li>.tooltipFn          - (optional) override the tooltip contents generation functions. Should take a data point and
 *                           return HTML markup for the tooltip contents. Setting this overrides the tooltipType value.
 * <li>.area               - (optional) overrides the default Area properties of the C3 chart
 * <li>.size               - (optional) overrides the default Size properties of the C3 chart
 * <li>.axis               - (optional) overrides the default Axis properties of the C3 chart
 * <li>.color              - (optional) overrides the default Color properties of the C3 chart
 * <li>.legend             - (optional) overrides the default Legend properties of the C3 chart
 * <li>.point              - (optional) overrides the default Point properties of the C3 chart
 * </ul>
 *
 * @param {object} chartData the data to be shown as an area chart<br/>
 * First and second Array elements, xData and yData, must exist, next data arrays are optional.<br/>
 * <ul style='list-style-type: none'>
 * <li>.xData      - Array, X values for the data points, first element must be the name of the data
 * <li>.yData      - Array, Y Values for the data points, first element must be the name of the data
 * <li>.yData1     - Array, Y Values for the data points, first element must be the name of the data
 * <li>.[...]      - Array, Y Values for the data points, first element must be the name of the data
 * </ul>
 *
 * @param {boolean=} showXAxis override config settings for showing the X Axis
 * @param {boolean=} showYAxis override config settings for showing the Y Axis
 * @param {boolean=} setAreaChart override config settings for showing area type chart

 * @example
 <example module="patternfly.charts">
   <file name="index.html">
     <div ng-controller="ChartCtrl" class="row" style="display:inline-block; width: 100%;">
       <div class="col-md-12">
         <pf-line-chart config="config" chart-data="data" set-area-chart="custAreaChart" show-x-axis="custShowXAxis" show-y-axis="custShowYAxis"></pf-line-chart>
       </div>
       <hr class="col-md-12">
       <div class="col-md-12">
         <div class="row">
           <div class="col-md-6">
             <form role="form"">
               <div class="form-group">
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custShowXAxis">X Axis</input>
                 </label>
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custShowYAxis">Y Axis</input>
                 </label>
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custAreaChart">Area Chart</input>
                 </label>
               </div>
             </form>
           </div>
           <div class="col-md-3">
                 <button ng-click="addDataPoint()">Add Data Point</button>
                 <button ng-click="resetData()">Reset Data</button>
           </div>
         </div>
       </div>
       <div class="col-md-12">
         <div class="row">
           <div class="col-md-6">
             <form role="form"">
               <div class="form-group">
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="data.dataAvailable">Data Available</input>
                 </label>
               </div>
             </form>
           </div>
         </div>
       </div>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.charts' ).controller( 'ChartCtrl', function( $scope, pfUtils ) {

       $scope.config = {
         chartId: 'exampleLine',
         grid: {y: {show: false}},
         point: {r: 1},
         color: {pattern: [pfUtils.colorPalette.blue, pfUtils.colorPalette.green]}
       };

       var today = new Date();
       var dates = ['dates'];
       for (var d = 20 - 1; d >= 0; d--) {
         dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
       }

       $scope.data = {
         dataAvailable: true,
         xData: dates,
         yData0: ['Created', 12, 10, 10, 62, 17, 10, 15, 13, 17, 10, 12, 10, 10, 12, 17, 16, 15, 13, 17, 10],
         yData1: ['Deleted', 10, 17, 76, 14, 10, 10, 10, 10, 10, 10, 10, 17, 17, 14, 10, 10, 10, 10, 10, 10]
       };

       $scope.custShowXAxis = false;
       $scope.custShowYAxis = false;
       $scope.custAreaChart = false;

       $scope.addDataPoint = function () {
         $scope.data.xData.push(new Date($scope.data.xData[$scope.data.xData.length - 1].getTime() + (24 * 60 * 60 * 1000)));
         $scope.data.yData0.push(Math.round(Math.random() * 100));
         $scope.data.yData1.push(Math.round(Math.random() * 100));
       };

       $scope.resetData = function () {
         $scope.data = {
           xData: dates,
           yData0: ['Created', 12, 10, 10, 62],
           yData1: ['Deleted', 10, 17, 76, 14]
         };
       };
     });
   </file>
 </example>
 */
angular.module('patternfly.charts').component('pfLineChart', {
  bindings: {
    config: '<',
    chartData: '<',
    showXAxis: '<?',
    showYAxis: '<?',
    setAreaChart: '<?'
  },
  templateUrl: 'charts/line/line-chart.html',
  controller: ["pfUtils", function (pfUtils) {
    'use strict';
    var ctrl = this, prevChartData;

    ctrl.updateAll = function () {
      // Need to deep watch changes in chart data
      prevChartData = angular.copy(ctrl.chartData);

      // Create an ID for the chart based on the chartId in the config if given
      if (ctrl.lineChartId === undefined) {
        ctrl.lineChartId = 'lineChart';
        if (ctrl.config.chartId) {
          ctrl.lineChartId = ctrl.config.chartId + ctrl.lineChartId;
        }
      }

      /*
       * Setup Axis options. Default is to not show either axis. This can be overridden in two ways:
       *   1) in the config, setting showAxis to true will show both axes
       *   2) in the attributes showXAxis and showYAxis will override the config if set
       *
       * By default only line and the tick marks are shown, no labels. This is a line and should be used
       * only to show a brief idea of trending. This can be overridden by setting the config.axis options per C3
       */

      if (ctrl.showXAxis === undefined) {
        ctrl.showXAxis = (ctrl.config.showAxis !== undefined) && ctrl.config.showAxis;
      }

      if (ctrl.showYAxis === undefined) {
        ctrl.showYAxis = (ctrl.config.showAxis !== undefined) && ctrl.config.showAxis;
      }

      ctrl.defaultConfig = patternfly.c3ChartDefaults().getDefaultLineConfig();
      ctrl.defaultConfig.axis = {
        x: {
          show: ctrl.showXAxis === true,
          type: 'timeseries',
          tick: {
            format: function () {
              return '';
            }
          }
        },
        y: {
          show: ctrl.showYAxis === true,
          tick: {
            format: function () {
              return '';
            }
          }
        }
      };

      /*
       * Setup Chart type option. Default is Line Chart.
       */
      if (ctrl.setAreaChart === undefined) {
        ctrl.setAreaChart = (ctrl.config.setAreaChart !== undefined) && ctrl.config.setAreaChart;
      }

      // Convert the given data to C3 chart format
      ctrl.config.data = ctrl.getLineData(ctrl.chartData);

      // Override defaults with callers specifications
      ctrl.defaultConfig = pfUtils.merge(ctrl.defaultConfig, ctrl.config);

      // Will trigger c3 chart generation
      ctrl.chartConfig = pfUtils.merge(ctrl.defaultConfig, ctrl.config);
    };

    /*
     * Convert the config data to C3 Data
     */
    ctrl.getLineData = function (chartData) {
      var lineData = {
        type: ctrl.setAreaChart ? "area" : "line"
      };

      if (chartData && chartData.dataAvailable !== false && chartData.xData) {
        lineData.x = chartData.xData[0];
        // Convert the chartData dictionary into a C3 columns data arrays
        lineData.columns = Object.keys(chartData).map(function (key) {
          return chartData[key];
        });
      }

      return lineData;
    };

    ctrl.$onChanges = function (changesObj) {
      ctrl.updateAll();
    };

    ctrl.$doCheck = function () {
      // do a deep compare on chartData
      if (!angular.equals(ctrl.chartData, prevChartData)) {
        ctrl.updateAll();
      }
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.charts.component:pfSparklineChart
 * @restrict E
 *
 * @description
 *   Component for rendering a sparkline chart.
 *   <br><br>
 *   See http://c3js.org/reference.html for a full list of C3 chart options.
 *
 * @param {object} config configuration settings for the sparkline chart:<br/>
 * <ul style='list-style-type: none'>
 * <li>.chartId            - the ID of the container that the chart should bind to
 * <li>.units              - unit label for values, ex: 'MHz','GB', etc..
 * <li>.tooltipType        - (optional) set the type of tooltip, valid values:
 * <ul style='list-style-type: none'>
 * <li>'default'           - show the data point value and the data point name.
 * <li>'usagePerDay'       - show the date, percent used, and used value for the data point.
 * <li>'valuePerDay'       - show the date and value for the data point.
 * <li>'percentage'        - show the current data point as a percentage.
 * </ul>
 * <li>.tooltipFn          - (optional) override the tooltip contents generation functions. Should take a data point and
 *                           return HTML markup for the tooltip contents. Setting this overrides the tooltipType value.
 * <li>.area               - (optional) overrides the default Area properties of the C3 chart
 * <li>.size               - (optional) overrides the default Size properties of the C3 chart
 * <li>.axis               - (optional) overrides the default Axis properties of the C3 chart
 * <li>.color              - (optional) overrides the default Color properties of the C3 chart
 * <li>.legend             - (optional) overrides the default Legend properties of the C3 chart
 * <li>.point              - (optional) overrides the default Point properties of the C3 chart
 * </ul>
 *
 * @param {object} chartData the data to be shown as an area chart<br/>
 * <ul style='list-style-type: none'>
 * <li>.xData         - Array, X values for the data points, first element must be the name of the data
 * <li>.yData         - Array, Y Values for the data points, first element must be the name of the data
 * <li>.total         - (optional) The Total amount, used when determining percentages
 * <li>.dataAvailable - Flag if there is data available - default: true
 * </ul>
 *
 * @param {int=} chartHeight   height of the sparkline chart
 * @param {boolean=} showXAxis override config settings for showing the X Axis
 * @param {boolean=} showYAxis override config settings for showing the Y Axis

 * @example
 <example module="patternfly.charts">
   <file name="index.html">
     <div ng-controller="ChartCtrl" class="row" style="display:inline-block; width: 100%;">
       <div class="col-md-12">
         <pf-sparkline-chart config="config" chart-data="data" chart-height="custChartHeight" show-x-axis="custShowXAxis" show-y-axis="custShowYAxis"></pf-sparkline-chart>
       </div>
       <hr class="col-md-12">
       <div class="col-md-12">
         <form role="form">
           <div class="form-group">
             <label>Tooltip Type</label>
             </br>
             <label class="radio-inline">
               <input type="radio" ng-model="config.tooltipType" value="default">Default</input>
             </label>
             <label class="radio-inline">
               <input type="radio" ng-model="config.tooltipType" value="usagePerDay">Usage Per Day</input>
             </label>
             <label class="radio-inline">
               <input type="radio" ng-model="config.tooltipType" value="valuePerDay">Value Per Day</input>
             </label>
             <label class="radio-inline">
               <input type="radio" ng-model="config.tooltipType" value="percentage">Percentage</input>
             </label>
           </div>
         </form>
         <div class="row">
           <div class="col-md-6">
             <form role="form"">
               <div class="form-group">
                 <label>Show</label>
                 </br>
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custShowXAxis">X Axis</input>
                 </label>
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custShowYAxis">Y Axis</input>
                 </label>
               </div>
             </form>
           </div>
           <div class="col-md-3">
             <form role="form" >
               <div class="form-group">
                 <label>Chart Height</label>
                 </br>
                 <input style="height:25px; width:60px;" type="number" ng-model="custChartHeight"></input>
               </div>
             </form>
           </div>
           <div class="col-md-3">
                 <button ng-click="addDataPoint()">Add Data Point</button>
           </div>
         </div>
        <div class="row">
         <div class="col-md-6">
           <form role="form"">
             <div class="form-group">
               <label class="checkbox-inline">
                 <input type="checkbox" ng-model="data.dataAvailable">Data Available</input>
               </label>
             </div>
           </form>
         </div>
       </div>
       </div>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.charts' ).controller( 'ChartCtrl', function( $scope ) {

       $scope.config = {
         chartId: 'exampleSparkline',
         tooltipType: 'default'
       };

       var today = new Date();
       var dates = ['dates'];
       for (var d = 20 - 1; d >= 0; d--) {
         dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
       }

       $scope.data = {
         dataAvailable: true,
         total: 100,
         xData: dates,
         yData: ['used', 10, 20, 30, 20, 30, 10, 14, 20, 25, 68, 54, 56, 78, 56, 67, 88, 76, 65, 87, 76]
       };

       $scope.custShowXAxis = false;
       $scope.custShowYAxis = false;
       $scope.custChartHeight = 60;

       $scope.addDataPoint = function () {
         $scope.data.xData.push(new Date($scope.data.xData[$scope.data.xData.length - 1].getTime() + (24 * 60 * 60 * 1000)));
         $scope.data.yData.push(Math.round(Math.random() * 100));
       };
     });
   </file>
 </example>
 */
angular.module('patternfly.charts').component('pfSparklineChart', {
  bindings: {
    config: '<',
    chartData: '<',
    chartHeight: '<?',
    showXAxis: '<?',
    showYAxis: '<?'
  },
  templateUrl: 'charts/sparkline/sparkline-chart.html',
  controller: ["pfUtils", function (pfUtils) {
    'use strict';
    var ctrl = this, prevChartData;

    ctrl.updateAll = function () {
      // Need to deep watch changes in chart data
      prevChartData = angular.copy(ctrl.chartData);

      // Create an ID for the chart based on the chartId in the config if given
      if (ctrl.sparklineChartId === undefined) {
        ctrl.sparklineChartId = 'sparklineChart';
        if (ctrl.config.chartId) {
          ctrl.sparklineChartId = ctrl.config.chartId + ctrl.sparklineChartId;
        }
      }

      /*
       * Setup Axis options. Default is to not show either axis. This can be overridden in two ways:
       *   1) in the config, setting showAxis to true will show both axes
       *   2) in the attributes showXAxis and showYAxis will override the config if set
       *
       * By default only line and the tick marks are shown, no labels. This is a sparkline and should be used
       * only to show a brief idea of trending. This can be overridden by setting the config.axis options per C3
       */

      if (ctrl.showXAxis === undefined) {
        ctrl.showXAxis = (ctrl.config.showAxis !== undefined) && ctrl.config.showAxis;
      }

      if (ctrl.showYAxis === undefined) {
        ctrl.showYAxis = (ctrl.config.showAxis !== undefined) && ctrl.config.showAxis;
      }

      ctrl.defaultConfig = patternfly.c3ChartDefaults().getDefaultSparklineConfig();
      ctrl.defaultConfig.axis = {
        x: {
          show: ctrl.showXAxis === true,
          type: 'timeseries',
          tick: {
            format: function () {
              return '';
            }
          }
        },
        y: {
          show: ctrl.showYAxis === true,
          tick: {
            format: function () {
              return '';
            }
          }
        }
      };

      // Setup the default configuration
      ctrl.defaultConfig.tooltip = ctrl.sparklineTooltip();
      if (ctrl.chartHeight) {
        ctrl.defaultConfig.size.height = ctrl.chartHeight;
      }
      ctrl.defaultConfig.units = '';

      // Convert the given data to C3 chart format
      ctrl.config.data = pfUtils.merge(ctrl.config.data, ctrl.getSparklineData(ctrl.chartData));

      // Override defaults with callers specifications
      ctrl.chartConfig = pfUtils.merge(ctrl.defaultConfig, ctrl.config);
    };

    /*
     * Convert the config data to C3 Data
     */
    ctrl.getSparklineData = function (chartData) {
      var sparklineData  = {
        type: 'area'
      };

      if (chartData && chartData.dataAvailable !== false && chartData.xData && chartData.yData) {
        sparklineData.x = chartData.xData[0];
        sparklineData.columns = [
          chartData.xData,
          chartData.yData
        ];
      }

      return sparklineData;
    };

    ctrl.getTooltipTableHTML = function (tipRows) {
      return '<div class="module-triangle-bottom">' +
        '  <table class="c3-tooltip">' +
        '    <tbody>' +
        tipRows +
        '    </tbody>' +
        '  </table>' +
        '</div>';
    };

    ctrl.sparklineTooltip = function () {
      return {
        contents: function (d) {
          var tipRows;
          var percentUsed = 0;

          if (ctrl.config.tooltipFn) {
            tipRows = ctrl.config.tooltipFn(d);
          } else {
            switch (ctrl.config.tooltipType) {
            case 'usagePerDay':
              if (ctrl.chartData.dataAvailable !== false && ctrl.chartData.total > 0) {
                percentUsed = Math.round(d[0].value / ctrl.chartData.total * 100.0);
              }
              tipRows =
                '<tr>' +
                '  <th colspan="2">' + d[0].x.toLocaleDateString() + '</th>' +
                '</tr>' +
                '<tr>' +
                '  <td class="name">' + percentUsed + '%:' + '</td>' +
                '  <td class="value text-nowrap">' + d[0].value + ' ' +  (ctrl.config.units ? ctrl.config.units + ' ' : '') + d[0].name + '</td>' +
                '</tr>';
              break;
            case 'valuePerDay':
              tipRows =
                '<tr>' +
                '  <td class="value">' +  d[0].x.toLocaleDateString() + '</td>' +
                '  <td class="value text-nowrap">' +  d[0].value + ' ' + d[0].name + '</td>' +
                '</tr>';
              break;
            case 'percentage':
              percentUsed = Math.round(d[0].value / ctrl.chartData.total * 100.0);
              tipRows =
                '<tr>' +
                '  <td class="name">' + percentUsed + '%' + '</td>' +
                '</tr>';
              break;
            default:
              tipRows = patternfly.c3ChartDefaults().getDefaultSparklineTooltip().contents(d);
            }
          }
          return ctrl.getTooltipTableHTML(tipRows);
        },
        position: function (data, width, height, element) {
          var center;
          var top;
          var chartBox;
          var graphOffsetX;
          var x;

          try {
            center = parseInt(element.getAttribute('x'));
            top = parseInt(element.getAttribute('y'));
            chartBox = document.querySelector('#' + ctrl.sparklineChartId).getBoundingClientRect();
            graphOffsetX = document.querySelector('#' + ctrl.sparklineChartId + ' g.c3-axis-y').getBoundingClientRect().right;
            x = Math.max(0, center + graphOffsetX - chartBox.left - Math.floor(width / 2));

            return {
              top: top - height,
              left: Math.min(x, chartBox.width - width)
            };
          } catch (e) {
          }
        }
      };
    };

    ctrl.$onChanges = function (changesObj) {
      ctrl.updateAll();
    };

    ctrl.$doCheck = function () {
      // do a deep compare on chartData
      if (!angular.equals(ctrl.chartData, prevChartData)) {
        ctrl.updateAll();
      }
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.charts.component:pfTopology
 * @restrict E
 *
 * @description
 *   Component for rendering a topology chart.  Individual nodes and relationships can be represented with this view.  CSS is especially important for rendering the nodes and lines.  The example inline contains specific examples that can be used to change the icon size and the line type of the relationships.
 *
 *   In addition; searching, filtering and label visibility is also supported.<br/>
 *
 * @param {object} items items to display in the topology chart, each is represented as an individual node.  The keys of this object are used in the relations attribute. The items should have a item.kind attribute, as well as the usual item.metadata and so on.:<br/>
 * <ul style='list-style-type: none'>
 * <li>.name    - name of the item the node represents
 * <li>.status  - optional status of the node (can be used to differentiate the circle color)
 * <li>.kind    - the kind of node - this is a general key that needs to be unique for grouping the nodes  Filtering and styles use this value as well to correctly select the nodes.
 * </ul>
 *
 * @param {object} relations the object containing all of the node relationships:<br/>
 * <ul style='list-style-type: none'>
 * <li>.source   - the key of the source node
 * <li>.target  -  the key of the target node
 * </ul>
 *
 * @param {object} icons The different icons to be used in the node representations
 * @param {object} selection The item to be selected
 * @param {object} force Optional. A D3 force layout to use instead of creating one by default. The force layout size will be updated, and layout will be started as appropriate.
 * @param {object} nodes The node configuration for the various types of nodes<br/>
 * @param {string} searchText Search text which is watched for changes and highlights the nodes matching the search text
 * @param {object} kinds The different kinds of nodes represented in the topology chart
 * @param {function (vertices, added) } chartRendered The argument will be D3 selection of elements that correspond to items. Each item has its data set to one of the items. The default implementation of this event sets the title from Kubernetes metadata and tweaks the look of for certain statuses. Use event.preventDefault() to prevent this default behavior.
 * @param {boolean} itemSelected A function that is dispatched when an item is selected (along with the node data associated with the function
 * @param {boolean} showLabels A watched boolean that determines whether or not lables should be displayed beneath the nodes
 * @param {function (node) } tooltipFunction A passed in tooltip function which can be used to overwrite the default tooltip behavior
 *
 * @example
 <example module="patternfly.charts">
 <file name="index.html">
 <div ng-controller="TopologyCtrl" class="container-topology">
 <pf-topology items="data.items" relations="data.relations" kinds="kinds" icons="data.icons" nodes="nodes" item-selected="itemSelected(item)" search-text="searchText" show-labels="showLabels" tooltip-function="tooltip(node)">
 </pf-topology>

 <div class="controls">
 <label id="selected"></label>

 <label>Search:
 <input type="text" name="input" ng-model="searchText">
 </label>

 <label>Show labels:
 <input type="checkbox" ng-model="showLabels">
 </label>
 <input type="button" ng-click="removeKind()" value="Remove Kind" />
 </div>
 </div>
 </file>

 <file name="script.js">
 angular.module( 'patternfly.charts' ).controller( 'TopologyCtrl', function( $scope, $rootScope ) {
    var index = 0;
    var datasets = [];

    function sink(dataset) {
      datasets.push(dataset);
    }

    sink({
      "items": {
        "ContainerManager10r20": {
          "name": "ocp-master.example.com",
          "kind": "ContainerManager",
          "miq_id": 10000000000020,
          "status": "Valid",
          "display_kind": "OpenshiftEnterprise"
        },
        "ContainerNode10r14": {
          "name": "ocp-master.example.com",
          "kind": "ContainerNode",
          "miq_id": 10000000000014,
          "status": "Ready",
          "display_kind": "Node"
        },
        "ContainerGroup10r240": {
          "name": "docker-registry-2-vrguw",
          "kind": "ContainerGroup",
          "miq_id": 10000000000240,
          "status": "Running",
          "display_kind": "Pod"
        },
        "Container10r235": {
          "name": "registry",
          "kind": "Container",
          "miq_id": 10000000000235,
          "status": "Error",
          "display_kind": "Container"
        },
        "ContainerReplicator10r56": {
          "name": "docker-registry-2",
          "kind": "ContainerReplicator",
          "miq_id": 10000000000056,
          "status": "OK",
          "display_kind": "Replicator"
        },
        "ContainerService10r61": {
          "name": "docker-registry",
          "kind": "ContainerService",
          "miq_id": 10000000000061,
          "status": "Unknown",
          "display_kind": "Service"
        },
      },
      "relations": [
        {
          "source": "ContainerManager10r20",
          "target": "ContainerNode10r14"
        }, {
          "source": "ContainerNode10r14",
          "target": "ContainerGroup10r240"
        }, {
          "source": "ContainerGroup10r240",
          "target": "Container10r235"
        }, {
          "source": "ContainerGroup10r240",
          "target": "ContainerReplicator10r56"
        }, {
          "source": "ContainerGroup10r240",
          "target": "ContainerService10r61"
        }, {
          "source": "ContainerNode10r14",
          "target": "ContainerGroup10r241"
        }, {
          "source": "ContainerGroup10r241",
          "target": "Container10r236"
        }, {
          "source": "ContainerGroup10r241",
          "target": "ContainerReplicator10r57"
        }
      ],
      "icons": {
        "AvailabilityZone": {
          "type": "glyph",
          "icon": "",
          "fontfamily": "PatternFlyIcons-webfont"
        },
        "ContainerReplicator": {
          "type": "glyph",
          "icon": "",
          "fontfamily": "PatternFlyIcons-webfont"
        },
        "ContainerGroup": {
          "type": "glyph",
          "icon": "",
          "fontfamily": "FontAwesome"
        },
        "ContainerNode": {
          "type": "glyph",
          "icon": "",
          "fontfamily": "PatternFlyIcons-webfont"
        },
        "ContainerService": {
          "type": "glyph",
          "icon": "",
          "fontfamily": "PatternFlyIcons-webfont"
        },
        "ContainerRoute": {
          "type": "glyph",
          "icon": "",
          "fontfamily": "PatternFlyIcons-webfont"
        },
        "Container": {
          "type": "glyph",
          "icon": "",
          "fontfamily": "FontAwesome"
        },
        "Host": {
          "type": "glyph",
          "icon": "",
          "fontfamily": "PatternFlyIcons-webfont"
        },
        "Vm": {
          "type": "glyph",
          "icon": "",
          "fontfamily": "PatternFlyIcons-webfont"
        },
        "ContainerManager": {
          "type": "glyph",
          "icon": "",
          "fontfamily": "PatternFlyIcons-webfont"
        }
      },
    });

    $rootScope.data = datasets[index];

    var nodeKinds = {
      "ContainerReplicator": true,
      "ContainerGroup": true,
      "Container": true,
      "ContainerNode": true,
      "ContainerService": true,
      "Host": true,
      "Vm": true,
      "ContainerRoute": true,
      "ContainerManager": true
    };

    $rootScope.kinds = nodeKinds;

    var icons = $rootScope.data.icons;
    $scope.nodes = {};
    for(var kind in nodeKinds) {
      var icon = icons[kind];
      $scope.nodes[kind] = {
        "name": kind,
        "enabled": nodeKinds[kind],
        "radius": 16,
        "textX": 0,
        "textY": 5,
        "height": 18,
        "width": 18,
        "icon": icon.icon,
        "fontFamily": icon.fontfamily
      };
    }

    // Individual values can also be set for specific icons
    $scope.nodes.ContainerService.textY = 9;
    $scope.nodes.ContainerService.textX = -1;

    $scope.nodes.ContainerGroup.height = 30;
    $scope.nodes.ContainerGroup.width = 30;
    $scope.nodes.ContainerGroup.radius = 28;
    $scope.nodes.ContainerGroup.textY = 8;

    $scope.itemSelected = function (item) {
      var text = "";
      if (item) {
        text = "Selected: " + item.name;
      }
      angular.element(document.getElementById("selected")).text(text);
    };

    $scope.removeKind = function () {
      if($rootScope.kinds.ContainerNode) {
        delete $rootScope.kinds.ContainerNode;
      }
    };

    $scope.tooltip = function (node) {
      var status = [
        'Name: ' + node.item.name,
        'Type: ' + node.item.kind,
        'Status: ' + node.item.status
      ];
      return status;
    }
 });
 </file>
 <file name="topology.css">

 .pf-topology-svg g.Pod text {
    font-family: FontAwesome;
    font-size: 16px;
    fill: #1186C1;
  }

   .pf-topology-svg g.Node text {
    fill: #636363;
  }

   .pf-topology-svg g.Service text {
    fill: #ff7f0e;
  }

   .pf-topology-svg g.ReplicationController text {
    fill: #9467bd;
    font-size: 20px;
  }

   .pf-topology-svg line.ReplicationControllerPod {
    stroke-linecap: round;
    stroke-dasharray: 5, 2;
  }


  .pf-topology-svg line.ContainerServiceContainerGroup, .pf-topology-svg line.ContainerReplicatorContainerGroup, .pf-topology-svg line.ContainerServiceContainerRoute,
   .pf-topology-svg line.ContainerGroupContainerService, .pf-topology-svg line.ContainerGroupContainerReplicator {
    stroke-linecap: round;
    stroke-dasharray: 5.5;
  }


 .pf-topology-svg g.Container text.glyph {
    font-size: 18px;
  }

   .pf-topology-svg g.ContainerGroup text.glyph {
    font-size: 28px;
  }

   .pf-topology-svg g.Vm text.glyph, .pf-topology-svg g.Host text.glyph {
    fill: #636363;
  }

   .pf-topology-svg g.ContainerNode text.glyph {
    font-size: 18px;
  }

   .pf-topology-svg g.ContainerManager text.glyph {
    font-size: 18px;
  }
 </file>

 </example>
 */
;angular.module('patternfly.charts').component('pfTopology', {
  bindings: {
    items: '<',
    relations: '<',
    kinds: '<',
    icons: '<',
    selection: '<',
    force: '<',
    radius: '<',
    nodes: '<',
    searchText: '<?',
    chartRendered: '&?',
    itemSelected: '&?',
    showLabels: '<?',
    tooltipFunction: '&?'
  },
  controller: ["$element", "$attrs", function ($element, $attrs) {
    'use strict';
    var options, graph,
      ctrl = this,
      previousItems,
      previousRelations,
      previousKinds,
      contextMenuShowing,
      vs;
    var cache = { };

    ctrl.$onInit = function () {
      $element.css("display", "block");
      options = {"force": ctrl.force, "radius": ctrl.radius};
      ctrl.showLabels = false;

      $element.on("$destroy", function () {
        graph.close();
      });

      d3.select("body").on('click', function () {
        if (contextMenuShowing) {
          removeContextMenu();
        }
      });
    };

    ctrl.$onChanges = function (changesObj) {
      if (changesObj.searchText && graph) {
        search(changesObj.searchText.currentValue);
      }

      if (changesObj.showLabels && vs) {
        toggleLabelVisibility();
      }

      if (changesObj.selection && graph) {
        graph.select(changesObj.selection.currentValue || null);
      }
    };

    ctrl.$doCheck = function () {
      // do a deep compare on data
      if (graph) {
        if (!angular.equals(ctrl.kinds, previousKinds)) {
          previousKinds = angular.copy(ctrl.kinds);
          render(graph.kinds(ctrl.kinds));
        }

        if (!angular.equals(ctrl.items, previousItems) || !angular.equals(ctrl.relations, previousRelations)) {
          previousItems = angular.copy(ctrl.items);
          previousRelations = angular.copy(ctrl.relations);
          render(graph.data(ctrl.items, ctrl.relations));
        }
      }
    };

    ctrl.$postLink = function () {
      options = {"force": ctrl.force, "radius": ctrl.radius};
      graph = topologyGraph($element[0], notify, options);
    };

    function topologyGraph (selector, notify, options) {
      var outer = d3.select(selector);

      /* Kinds of objects to show */
      var kinds = null;

      /* Data we've been fed */
      var items = {};
      var relations = [];

      /* Graph information */
      var width;
      var height;
      var radius = 20;
      var timeout;
      var nodes = [];
      var links = [];
      var lookup = {};
      var selection = null;
      var force = options.force;
      var drag, svg, vertices, edges;

      if (options.radius) {
        radius = options.radius;
      }

      /* Allow the force to be passed in, default if not */
      if (!force) {
        force = d3.layout.force()
          .charge(-800)
          .gravity(0.2)
          .linkDistance(80);
      }

      drag = force.drag();

      svg = outer.append("svg")
        .attr("viewBox", "0 0 1600 1200")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("class", "pf-topology-svg");

      vertices = d3.select();
      edges = d3.select();

      force.on("tick", function () {
        edges.attr("x1", function (d) {
          return d.source.x;
        })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        vertices
          .attr("cx", function (d) {
            d.x = d.fixed ? d.x : Math.max(radius, Math.min(width - radius, d.x));
            return d.x;
          })
          .attr("cy", function (d) {
            d.y = d.fixed ? d.y : Math.max(radius, Math.min(height - radius, d.y));
            return d.y;
          })
          .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
      });

      drag
        .on("dragstart", function (d) {
          notify(d.item);

          if (d.fixed !== true) {
            d.floatpoint = [d.x, d.y];
          }
          d.fixed = true;
          d3.select(this).classed("fixed", true);
        })
        .on("dragend", function (d) {
          var moved = true;
          if (d.floatpoint) {
            moved = (d.x < d.floatpoint[0] - 5 || d.x > d.floatpoint[0] + 5) ||
              (d.y < d.floatpoint[1] - 5 || d.y > d.floatpoint[1] + 5);
            delete d.floatpoint;
          }
          d.fixed = moved && d.x > 3 && d.x < (width - 3) && d.y >= 3 && d.y < (height - 3);
          d3.select(this).classed("fixed", d.fixed);
        });

      svg
        .on("dblclick", function () {
          svg.selectAll("g")
            .classed("fixed", false)
            .each(function (d) {
              d.fixed = false;
            });
          force.start();
        })
        .on("click", function (ev) {
          if (!d3.select(d3.event.target).datum()) {
            notify(null);
          }
        });

      function select (item) {
        if (item !== undefined) {
          selection = item;
        }
        svg.selectAll("g")
          .classed("selected", function (d) {
            return d.item === selection;
          });
      }

      function adjust () {
        timeout = null;
        width = outer.node().clientWidth;
        height = outer.node().clientHeight;
        force.size([width, height]);
        svg.attr("viewBox", "0 0 " + width + " " + height);
        update();
      }

      function update () {
        var added;

        edges = svg.selectAll("line")
          .data(links);

        edges.exit().remove();
        edges.enter().insert("line", ":first-child");

        edges.attr("class", function (d) {
          return d.kinds;
        });

        vertices = svg.selectAll("g")
          .data(nodes, function (d) {
            return d.id;
          });

        vertices.exit().remove();

        added = vertices.enter().append("g")
          .call(drag);

        select(selection);

        force
          .nodes(nodes)
          .links(links)
          .start();

        return added;
      }

      function digest () {
        var pnodes = nodes;
        var plookup = lookup;
        var item, id, kind, node;
        var i, len, relation, s, t;
        /* The actual data for the graph */
        nodes = [];
        links = [];
        lookup = {};

        for (id in items) {
          if (id) {
            item = items[id];
            kind = item.kind;

            if (kinds && !kinds[kind]) {
              continue;
            }

            /* Prevents flicker */
            node = pnodes[plookup[id]];
            if (!node) {
              node = cache[id];
              delete cache[id];
              if (!node) {
                node = {};
              }
            }

            node.id = id;
            node.item = item;

            lookup[id] = nodes.length;
            nodes.push(node);
          }
        }
        for (i = 0, len = relations.length; i < len; i++) {
          relation = relations[i];

          s = lookup[relation.source];
          t = lookup[relation.target];
          if (s === undefined || t === undefined) {
            continue;
          }

          links.push({source: s, target: t, kinds: nodes[s].item.kind + nodes[t].item.kind});
        }

        if (width && height) {
          return update();
        }
        return d3.select();
      }

      function resized () {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(adjust, 1);
      }

      window.addEventListener('resize', resized);

      adjust();
      resized();

      return {
        select: select,
        kinds: function (value) {
          var added;
          kinds = value;
          added = digest();
          return [vertices, added];
        },
        data: function (newItems, newRelations) {
          var added;
          items = newItems || {};
          relations = newRelations || [];
          added = digest();
          return [vertices, added];
        },
        close: function () {
          var id, node;
          window.removeEventListener('resize', resized);
          window.clearTimeout(timeout);
          /*
           * Keep the positions of these items cached,
           * in case we are asked to make the same graph again.
           */
          cache = {};
          for (id in lookup) {
            if (id) {
              node = nodes[lookup[id]];
              delete node.item;
              cache[id] = node;
            }
          }

          nodes = [];
          lookup = {};
        }
      };
    }

    function search (query) {
      var svg = getSVG();
      var nodes = svg.selectAll("g");
      var selected, links;
      if (query !== "") {
        selected = nodes.filter(function (d) {
          return d.item.name.indexOf(query) === -1;
        });
        selected.style("opacity", "0.2");
        links = svg.selectAll("line");
        links.style("opacity", "0.2");
      }
    }

    function resetSearch (d3) {
      // Display all topology nodes and links
      d3.selectAll("g, line").transition()
        .duration(2000)
        .style("opacity", 1);
    }

    function toggleLabelVisibility () {
      if (ctrl.showLabels) {
        vs.selectAll("text.attached-label")
          .classed("visible", true);
      } else {
        vs.selectAll("text.attached-label")
          .classed("visible", false);
      }
    }

    function getSVG () {
      var graph = d3.select("pf-topology");
      var svg = graph.select('svg');
      return svg;
    }

    function notify (item) {
      ctrl.itemSelected({item: item});
      if ($attrs.selection === undefined) {
        graph.select(item);
      }
    }

    function icon (d) {
      return '#' + d.item.kind;
    }

    function title (d) {
      return d.item.name;
    }

    function render (args) {
      var vertices = args[0];
      var added = args[1];
      var event;

      // allow custom rendering of chart
      if (angular.isFunction(ctrl.chartRendered)) {
        event = ctrl.chartRendered({vertices: vertices, added: added});
      }

      if (!event || !event.defaultPrevented) {
        added.attr("class", function (d) {
          return d.item.kind;
        });

        added.append("circle")
          .attr("r", function (d) {
            return getDimensions(d).r;
          })
          .attr('class', function (d) {
            return getItemStatusClass(d);
          })
          .on("contextmenu", function (d) {
            contextMenu(ctrl, d);
          });

        added.append("title");

        added.on("dblclick", function (d) {
          return dblclick(d);
        });

        added.append("image")
          .attr("xlink:href", function (d) {
            // overwrite this . . .
            var iconInfo = ctrl.icons[d.item.kind];
            switch (iconInfo.type) {
            case 'image':
              return iconInfo.icon;
            case "glyph":
              return null;
            }
          })
          .attr("height", function (d) {
            var iconInfo = ctrl.icons[d.item.kind];
            if (iconInfo.type !== 'image') {
              return 0;
            }
            return 40;
          })
          .attr("width", function (d) {
            var iconInfo = ctrl.icons[d.item.kind];
            if (iconInfo.type !== 'image') {
              return 0;
            }
            return 40;
          })
          .attr("y", function (d) {
            return getDimensions(d).y;
          })
          .attr("x", function (d) {
            return getDimensions(d).x;
          })
          .on("contextmenu", function (d) {
            contextMenu(ctrl, d);
          });

        added.append("text")
          .each(function (d) {
            var iconInfo = ctrl.icons[d.item.kind];
            if (iconInfo.type !== 'glyph') {
              return;
            }
            d3.select(this).text(iconInfo.icon)
              .attr("class", "glyph")
              .attr('font-family', iconInfo.fontfamily);
          })

          .attr("y", function (d) {
            return getDimensions(d).y;
          })
          .attr("x", function (d) {
            return getDimensions(d).x;
          })
          .on("contextmenu", function (d) {
            contextMenu(this, d);
          });


        added.append("text")
          .attr("x", 26)
          .attr("y", 24)
          .text(function (d) {
            return d.item.name;
          })
          .attr('class', function () {
            var className = "attached-label";
            if (ctrl.showLabels) {
              return className + ' visible';
            }
            return className;
          });

        added.selectAll("title").text(function (d) {
          return tooltip(d).join("\n");
        });

        vs = vertices;
      }
      graph.select();
    }

    function tooltip (d) {
      if (ctrl.tooltipFunction) {
        return ctrl.tooltipFunction({node: d});
      }
      return 'Name: ' + d.item.name;
    }

    function removeContextMenu () {
      d3.event.preventDefault();
      d3.select('.popup').remove();
      contextMenuShowing = false;
    }

    function contextMenu (that, data) {
      var canvasSize, popupSize, canvas, mousePosition, popup;

      if (contextMenuShowing) {
        removeContextMenu();
      } else {
        d3.event.preventDefault();

        canvas = d3.select('pf-topology');
        mousePosition = d3.mouse(canvas.node());

        popup = canvas.append('div')
          .attr('class', 'popup')
          .style('left', mousePosition[0] + 'px')
          .style('top', mousePosition[1] + 'px');
        popup.append('h5').text('Actions on ' + data.item.kind);

        buildContextMenuOptions(popup, data);

        canvasSize = [
          canvas.node().offsetWidth,
          canvas.node().offsetHeight
        ];

        popupSize = [
          popup.node().offsetWidth,
          popup.node().offsetHeight
        ];

        if (popupSize[0] + mousePosition[0] > canvasSize[0]) {
          popup.style('left', 'auto');
          popup.style('right', 0);
        }

        if (popupSize[1] + mousePosition[1] > canvasSize[1]) {
          popup.style('top', 'auto');
          popup.style('bottom', 0);
        }
        contextMenuShowing = !contextMenuShowing;
      }
    }

    function buildContextMenuOptions (popup, data) {
      if (data.item.kind === 'Tag') {
        return false;
      }
      addContextMenuOption(popup, 'Go to summary page', data, dblclick);
    }

    function dblclick (d) {
      window.location.assign(d.url);
    }

    function addContextMenuOption (popup, text, data, callback) {
      popup.append('p').text(text).on('click', function () {
        callback(data);
      });
    }

    function getDimensions (d) {
      var nodeEntry = ctrl.nodes[d.item.kind];
      var defaultDimensions = defaultElementDimensions();
      if (nodeEntry) {
        if (nodeEntry.textX) {
          defaultDimensions.x = nodeEntry.textX;
        }
        if (nodeEntry.textY) {
          defaultDimensions.y = nodeEntry.textY;
        }

        if (nodeEntry.radius) {
          defaultDimensions.r = nodeEntry.radius;
        }
      }
      return defaultDimensions;
    }

    function defaultElementDimensions () {
      return { x: 0, y: 9, r: 17 };
    }

    function getItemStatusClass (d) {
      switch (d.item.status.toLowerCase()) {
      case "ok":
      case "active":
      case "available":
      case "on":
      case "ready":
      case "running":
      case "succeeded":
      case "valid":
        return "success";
      case "notready":
      case "failed":
      case "error":
      case "unreachable":
        return "error";
      case 'warning':
      case 'waiting':
      case 'pending':
        return "warning";
      case 'unknown':
      case 'terminated':
        return "unknown";
      }
    }
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.charts.directive:pfTrendsChart
 * @restrict E
 *
 * @description
 *   Component for rendering a trend chart. The trend chart combines overall data with a
 *   pfSparklineChart.
 *   <br><br>
 *   See http://c3js.org/reference.html for a full list of C3 chart options.<br>
 *   See also: {@link patternfly.charts.component:pfSparklineChart}
 *
 * @param {object} config configuration settings for the trends chart:<br/>
 * <ul style='list-style-type: none'>
 * <li>.chartId    - the unique id of this trends chart
 * <li>.title      - (optional) title of the Trends chart
 * <li>.layout     - (optional) the layout and sizes of titles and chart. Values are 'large' (default), 'small', 'compact', and 'inline'
 * <li>.trendLabel - (optional) the trend label used in the 'inline' layout
 * <li>.timeFrame  - (optional) the time frame for the data in the pfSparklineChart, ex: 'Last 30 Days'
 * <li>.units      - unit label for values, ex: 'MHz','GB', etc..
 * <li>.valueType  - (optional) the format of the latest data point which is shown in the title. Values are 'actual'(default) or 'percentage'
 * </ul>
 *
 * @param {object} chartData the data to be shown in the sparkline charts<br/>
 * <ul style='list-style-type: none'>
 * <li>.total  - number representing the total amount
 * <li>.xData  - Array, X values for the data points, first element must be the name of the data
 * <li>.yData  - Array, Y Values for the data points, first element must be the name of the data
 * <li>.dataAvailable - Flag if there is data available - default: true
 * </ul>
 *
 * @param {int=} chartHeight   height of the sparkline chart
 * @param {boolean=} showXAxis override sparkline config settings for showing the X Axis
 * @param {boolean=} showYAxis override sparkline config settings for showing the Y Axis
 * @example
 <example module="demo">
 <file name="index.html">
   <div ng-controller="ChartCtrl" class="row" style="display:inline-block; width: 100%;">
     <div class="col-md-12">
       <pf-trends-chart config="config" chart-data="data"
            show-x-axis="custShowXAxis" show-y-axis="custShowYAxis"></pf-trends-chart>
     </div>
     <hr class="col-md-12">
     <div class="col-md-12">
       <div class="row">
         <div class="col-md-4">
           <form role="form"">
             <div class="form-group">
               <label>Show</label></br>
               <label class="checkbox-inline">
                 <input type="checkbox" ng-model="custShowXAxis">X Axis</input>
               </label>
               <label class="checkbox-inline">
                 <input type="checkbox" ng-model="custShowYAxis">Y Axis</input>
               </label>
             </div>
           </form>
         </div>
         <div class="col-md-3">
           <form role="form" >
             <div class="form-group">
               <label>Layout</label></br>
               <div class="btn-group" uib-dropdown>
                 <button type="button" uib-dropdown-toggle class="btn btn-default">
                   {{layout.title}}
                   <span class="caret"></span>
                 </button>
                 <ul uib-dropdown-menu class="dropdown-menu-right" role="menu">
                   <li ng-repeat="item in layouts" ng-class="{'selected': item === layout}">
                     <a role="menuitem" tabindex="-1" ng-click="updateLayout(item)">
                       {{item.title}}
                     </a>
                   </li>
                 </ul>
               </div>
             </div>
           </form>
         </div>
         <div class="col-md-3">
           <form role="form" ng-hide="layout == 'inline'">
             <div class="form-group">
               <label>Title Value Type</label></br>
               <div class="btn-group" uib-dropdown>
                 <button type="button" uib-dropdown-toggle class="btn btn-default">
                   {{valueType.title}}
                   <span class="caret"></span>
                 </button>
                 <ul uib-dropdown-menu class="dropdown-menu-right" role="menu">
                   <li ng-repeat="item in valueTypes" ng-class="{'selected': item === valueType}">
                     <a role="menuitem" tabindex="-1" ng-click="updateValueType(item)">
                       {{item.title}}
                     </a>
                   </li>
                 </ul>
               </div>
             </div>
           </form>
         </div>
         <div class="col-md-2">
           <button ng-click="addDataPoint()">Add Data Point</button>
         </div>
       </div>
       <div class="row">
         <div class="col-md-6">
           <form role="form"">
             <div class="form-group">
               <label class="checkbox-inline">
                 <input type="checkbox" ng-model="data.dataAvailable">Data Available</input>
               </label>
             </div>
           </form>
         </div>
       </div>
     </div>
   </div>
 </file>
 <file name="script.js">
 angular.module( 'demo', ['patternfly.charts', 'patternfly.card', 'ui.bootstrap'] ).controller( 'ChartCtrl', function( $scope ) {

       $scope.config = {
         chartId      : 'exampleTrendsChart',
         title        : 'Network Utilization Trends',
         layout       : 'large',
         trendLabel   : 'Virtual Disk I/O',
         valueType    : 'actual',
         timeFrame    : 'Last 15 Minutes',
         units        : 'MHz',
         tooltipType  : 'percentage'
       };

       $scope.footerConfig = {
         iconClass : 'fa fa-plus-circle',
         text      : 'Add New Cluster',
         callBackFn: function () {
            alert("Footer Callback Fn Called");
          }
       }

       $scope.filterConfig = {
         filters : [{label:'Last 30 Days', value:'30'},
                      {label:'Last 15 Days', value:'15'},
                      {label:'Today', value:'today'}],
         callBackFn: function (f) {
            alert("Filter Callback Fn Called for '" + f.label + "' value = " + f.value);
          }
       }

       $scope.layouts = [
         {
           title: "Large",
           value: "large"
         },
         {
           title: "Small",
           value: "small"
         },
         {
           title: "Compact",
           value: "compact"
         },
         {
           title: "Inline",
           value: "inline"
         }
       ];

       $scope.layout = $scope.layouts[0];

       $scope.updateLayout = function(item) {
         $scope.layout = item;
         $scope.config.layout = item.value;
       };

       $scope.valueTypes = [
         {
           title: "Actual",
           value: "actual"
         },
         {
           title: "Percentage",
           value: "percentage"
         }
       ];

       $scope.valueType = $scope.valueTypes[0];

       $scope.updateValueType = function(item) {
         $scope.valueType = item;
         $scope.config.valueType = item.value;
       };

      var today = new Date();
      var dates = ['dates'];
      for (var d = 20 - 1; d >= 0; d--) {
          dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
      }

       $scope.data = {
           dataAvailable: true,
           total: 250,
           xData: dates,
           yData: ['used', 10, 20, 30, 20, 30, 10, 14, 20, 25, 68, 54, 56, 78, 56, 67, 88, 76, 65, 87, 76]
       };

       $scope.custShowXAxis = false;
       $scope.custShowYAxis = false;

       $scope.addDataPoint = function () {
         $scope.data.xData.push(new Date($scope.data.xData[$scope.data.xData.length - 1].getTime() + (24 * 60 * 60 * 1000)));
         $scope.data.yData.push(Math.round(Math.random() * 100));
       };
     });
 </file>
 </example>
 */
angular.module('patternfly.charts').component('pfTrendsChart', {
  bindings: {
    config: '<',
    chartData: '<',
    chartHeight: '<?',
    showXAxis: '<?',
    showYAxis: '<?'
  },
  templateUrl: 'charts/trends/trends-chart.html',
  controller: ["pfUtils", function (pfUtils) {
    'use strict';
    var ctrl = this, prevChartData, prevConfig;
    var SMALL = 30, LARGE = 60;

    ctrl.updateAll = function () {
      // Need to deep watch changes
      prevChartData = angular.copy(ctrl.chartData);
      prevConfig = angular.copy(ctrl.config);

      ctrl.showLargeCardLayout = (!ctrl.config.layout || ctrl.config.layout === 'large');
      ctrl.showSmallCardLayout = (ctrl.config.layout === 'small');
      ctrl.showActualValue = (!ctrl.config.valueType || ctrl.config.valueType === 'actual');
      ctrl.showPercentageValue = (ctrl.config.valueType === 'percentage');
    };

    ctrl.getPercentageValue = function () {
      var pctValue = 0;

      if (ctrl.chartData.dataAvailable !== false && ctrl.chartData.total > 0) {
        pctValue = Math.round(ctrl.getLatestValue() / ctrl.chartData.total * 100.0);
      }
      return pctValue;
    };
    ctrl.getLatestValue = function () {
      var latestValue = 0;
      if (ctrl.chartData.yData && ctrl.chartData.yData.length > 0) {
        latestValue = ctrl.chartData.yData[ctrl.chartData.yData.length - 1];
      }
      return latestValue;
    };
    ctrl.getChartHeight = function () {
      var retValue = LARGE;
      if (ctrl.chartHeight) {
        retValue = ctrl.chartHeight;
      } else if (ctrl.config.layout === 'small') {
        retValue = SMALL;
      }
      return retValue;
    };

    ctrl.$onChanges = function (changesObj) {
      ctrl.updateAll();
    };

    ctrl.$doCheck = function () {
      // do a deep compare on chartData and config
      if (!angular.equals(ctrl.chartData, prevChartData) || !angular.equals(ctrl.config, prevConfig)) {
        ctrl.updateAll();
      }
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.charts.directive:pfUtilizationBarChart
 * @restrict E
 *
 * @description
 *   Component for rendering a utilization bar chart
 *   There are three possible fill colors for Used Percentage, dependent on whether or not there are thresholds:<br/>
 *   <ul>
 *   <li>When no thresholds exist, or if the used percentage has not surpassed any thresholds, the indicator is blue.
 *   <li>When the used percentage has surpassed the warning threshold, but not the error threshold, the indicator is orange.
 *   <li>When the used percentage has surpassed the error threshold, the indicator is is red.
 *   </ul>
 *
 * @param {object} chartData the data to be shown in the utilization bar chart<br/>
 * <ul style='list-style-type: none'>
 * <li>.used          - number representing the amount used
 * <li>.total         - number representing the total amount
 * <li>.dataAvailable - Flag if there is data available - default: true
 * </ul>
 *
 * @param {object=} chart-title The title displayed on the left-hand side of the chart
 * @param {object=} chart-footer The label displayed on the right-hand side of the chart.  If chart-footer is not
 * specified, the automatic footer-label-format will be used.
 * @param {object=} layout Various alternative layouts the utilization bar chart may have:<br/>
 * <ul style='list-style-type: none'>
 * <li>.type - The type of layout to use.  Valid values are 'regular' (default) displays the standard chart layout,
 * and 'inline' displays a smaller, inline layout.</li>
 * <li>.titleLabelWidth - Width of the left-hand title label when using 'inline' layout. Example values are "120px", "20%", "10em", etc..</li>
 * <li>.footerLabelWidth - Width of the right-hand used label when using 'inline' layout. Example values are "120px", "20%", "10em", etc..</li>
 * </ul>
 * @param {string=} footer-label-format The auto-format of the label on the right side of the bar chart when chart-footer
 * has not been specified. Values may be:<br/>
 * <ul style='list-style-type: none'>
 * <li>'actual' - (default) displays the standard label of '(n) of (m) (units) Used'.
 * <li>'percent' - displays a percentage label of '(n)% Used'.</li>
 * </ul>
 * @param {object=} units to be displayed on the chart. Examples: "GB", "MHz", "I/Ops", etc...
 * @param {string=} threshold-error The percentage used, when reached, denotes an error.  Valid values are 1-100. When the error threshold
 * has been reached, the used donut arc will be red.
 * @param {string=} threshold-warning The percentage usage, when reached, denotes a warning.  Valid values are 1-100. When the warning threshold
 * has been reached, the used donut arc will be orange.
 *
 * @example
 <example module="patternfly.example">
   <file name="index.html">
     <div ng-controller="ChartCtrl">

       <label class="label-title">Default Layout, no Thresholds</label>
       <pf-utilization-bar-chart chart-data=data1 chart-title=title1 units=units1></pf-utilization-bar-chart>
       <br>
       <label class="label-title">Inline Layouts with Error, Warning, and Ok Thresholds</label>
       <pf-utilization-bar-chart chart-data=data5 chart-title=title5 layout=layoutInline units=units5 threshold-error="85" threshold-warning="60">../utilization-trend/utilization-trend-chart-directive.js</pf-utilization-bar-chart>
       <pf-utilization-bar-chart chart-data=data3 chart-title=title3 layout=layoutInline units=units3 threshold-error="85" threshold-warning="60"></pf-utilization-bar-chart>
       <pf-utilization-bar-chart chart-data=data2 chart-title=title2 layout=layoutInline units=units2 threshold-error="85" threshold-warning="60"></pf-utilization-bar-chart>
       <br>
       <label class="label-title">layout='inline', footer-label-format='percent', and custom chart-footer labels</label>
       <pf-utilization-bar-chart chart-data=data2 chart-title=title2 layout=layoutInline footer-label-format='percent' units=units2 threshold-error="85" threshold-warning="60"></pf-utilization-bar-chart>
       <pf-utilization-bar-chart chart-data=data3 chart-title=title3 layout=layoutInline footer-label-format='percent' units=units3 threshold-error="85" threshold-warning="60"></pf-utilization-bar-chart>
       <pf-utilization-bar-chart chart-data=data4 chart-title=title4 chart-footer=footer1 layout=layoutInline units=units4 threshold-error="85" threshold-warning="60"></pf-utilization-bar-chart>
       <pf-utilization-bar-chart chart-data=data5 chart-title=title5 chart-footer=footer2 layout=layoutInline units=units5 threshold-error="85" threshold-warning="60"></pf-utilization-bar-chart>
       <div class="row">
         <div class="col-md-6">
           <form role="form"">
             <div class="form-group">
               <label class="checkbox-inline">
                 <input type="checkbox" ng-model="data1.dataAvailable">Data Available</input>
               </label>
             </div>
           </form>
         </div>
       </div>
     </div>
   </file>

   <file name="script.js">
   angular.module( 'patternfly.example', ['patternfly.charts', 'patternfly.card']);

   angular.module( 'patternfly.example' ).controller( 'ChartCtrl', function( $scope, $interval ) {

    $scope.title1 = 'RAM Usage';
    $scope.units1 = 'MB';

    $scope.data1 = {
      'dataAvailable': true,
      'used': '8',
      'total': '24'
    };

    $scope.title2      = 'Memory';
    $scope.units2      = 'GB';

    $scope.data2 = {
      'used': '25',
      'total': '100'
    };

    $scope.title3 = 'CPU Usage';
    $scope.units3 = 'MHz';

    $scope.data3 = {
      'used': '420',
      'total': '500',
    };

    $scope.title4 = 'Disk Usage';
    $scope.units4 = 'TB';
    $scope.data4 = {
      'used': '350',
      'total': '500',
    };

    $scope.title5 = 'Disk I/O';
    $scope.units5 = 'I/Ops';
    $scope.data5 = {
      'used': '450',
      'total': '500',
    };

    $interval(function () {
      $scope.data5.used = Number($scope.data5.used) + 40;
      if ($scope.data5.used > 500) {
        $scope.data5.used = 10;
      }
    }, 1000);

    $scope.layoutInline = {
      'type': 'inline'
    };

    $scope.footer1 = '<strong>500 TB</strong> Total';
    $scope.footer2 = '<strong>450 of 500</strong> Total';

   });
   </file>
 </example>
*/

angular.module('patternfly.charts').component('pfUtilizationBarChart', {
  bindings: {
    chartData: '=',
    chartTitle: '=',
    chartFooter: '=',
    units: '=',
    thresholdError: '=?',
    thresholdWarning: '=?',
    footerLabelFormat: '@?',
    layout: '=?'
  },

  templateUrl: 'charts/utilization-bar/utilization-bar-chart.html',
  controller: ["$timeout", function ($timeout) {
    'use strict';
    var ctrl = this, prevChartData, prevLayout;

    ctrl.updateAll = function () {
      // Need to deep watch changes
      prevChartData = angular.copy(ctrl.chartData);
      prevLayout = angular.copy(ctrl.layout);

      //Calculate the percentage used
      ctrl.chartData.percentageUsed = Math.round(100 * (ctrl.chartData.used / ctrl.chartData.total));

      if (ctrl.thresholdError || ctrl.thresholdWarning) {
        ctrl.isError = (ctrl.chartData.percentageUsed >= ctrl.thresholdError);
        ctrl.isWarn  = (ctrl.chartData.percentageUsed >= ctrl.thresholdWarning &&
                         ctrl.chartData.percentageUsed < ctrl.thresholdError);
        ctrl.isOk    = (ctrl.chartData.percentageUsed < ctrl.thresholdWarning);
      }

      //Animate in the chart load.
      ctrl.animate = true;
      $timeout(function () {
        ctrl.animate = false;
      }, 0);
    };

    ctrl.$onChanges = function (changesObj) {
      ctrl.updateAll();
    };

    ctrl.$doCheck = function () {
      // do a deep compare on chartData and layout
      if (!angular.equals(ctrl.chartData, prevChartData) || !angular.equals(ctrl.layout, prevLayout)) {
        ctrl.updateAll();
      }
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.charts.directive:pfUtilizationTrendChart
 * @restrict E
 *
 * @description
 *   Component for rendering a utilization trend chart. The utilization trend chart combines overall
 *   data with a pfDonutPctChart and a pfSparklineChart. Add the options for the pfDonutChart via
 *   the donutConfig parameter. Add the options for the pfSparklineChart via the sparklineConfig
 *   parameter.
 *   <br><br>
 *   See http://c3js.org/reference.html for a full list of C3 chart options.
 *
 * @param {object} config configuration settings for the utilization trend chart:<br/>
 * <ul style='list-style-type: none'>
 * <li>.title        - title of the Utilization chart
 * <li>.units        - unit label for values, ex: 'MHz','GB', etc..
 * </ul>
 *
 * @param {object} donutConfig configuration settings for the donut pct chart, see pfDonutPctChart for specifics<br/>
 * @param {object} sparklineConfig configuration settings for the sparkline chart, see pfSparklineChart for specifics<br/>
 *
 * @param {object} chartData the data to be shown in the donut and sparkline charts<br/>
 * <ul style='list-style-type: none'>
 * <li>.used   - number representing the amount used
 * <li>.total  - number representing the total amount
 * <li>.xData  - Array, X values for the data points, first element must be the name of the data
 * <li>.yData  - Array, Y Values for the data points, first element must be the name of the data
 * <li>.dataAvailable - Flag if there is data available - default: true
 * </ul>
 *
 * @param {string=} donutCenterLabel specifies the contents of the donut's center label.<br/>
 * <strong>Values:</strong>
 * <ul style='list-style-type: none'>
 * <li> 'used'      - displays the Used amount in the center label (default)
 * <li> 'available' - displays the Available amount in the center label
 * <li> 'percent'   - displays the Usage Percent of the Total amount in the center label
 * <li> 'none'      - does not display the center label
 * </ul>
 * @param {int=} sparklineChartHeight   height of the sparkline chart
 * @param {boolean=} showSparklineXAxis override sparkline config settings for showing the X Axis
 * @param {boolean=} showSparklineYAxis override sparkline config settings for showing the Y Axis

 * @example
 <example module="patternfly.charts">
   <file name="index.html">
     <div ng-controller="ChartCtrl" class="row" style="display:inline-block; width: 100%;">
       <div class="col-md-12">
         <pf-utilization-trend-chart config="config"
              chart-data="data" center-label="centerLabel"
              donut-config="donutConfig" sparkline-config="sparklineConfig"
              sparkline-chart-height="custChartHeight"
              show-sparkline-x-axis="custShowXAxis"
              show-sparkline-y-axis="custShowYAxis">
         </pf-utilization-trend-chart>
       </div>
       <hr class="col-md-12">
       <div class="col-md-12">
         <form role="form">
           <div class="form-group">
           <label>Donut Center Label Type</label>
           </br>
           <label class="radio-inline">
             <input type="radio" ng-model="centerLabel" value="used">Used</input>
           </label>
           <label class="radio-inline">
             <input type="radio" ng-model="centerLabel" value="available">Available</input>
           </label>
           <label class="radio-inline">
             <input type="radio" ng-model="centerLabel" value="percent">Percent</input>
           </label>
           <label class="radio-inline">
             <input type="radio" ng-model="centerLabel" value="none">None</input>
           </label>
           </div>
         </form>
         <form role="form">
           <div class="form-group">
             <label>Sparkline Tooltip Type</label>
               </br>
             <label class="radio-inline">
               <input type="radio" ng-model="sparklineConfig.tooltipType" value="default">Default</input>
             </label>
             <label class="radio-inline">
               <input type="radio" ng-model="sparklineConfig.tooltipType" value="usagePerDay">Usage Per Day</input>
             </label>
             <label class="radio-inline">
               <input type="radio" ng-model="sparklineConfig.tooltipType" value="valuePerDay">Value Per Day</input>
             </label>
             <label class="radio-inline">
               <input type="radio" ng-model="sparklineConfig.tooltipType" value="percentage">Percentage</input>
             </label>
           </div>
         </form>
         <div class="row">
           <div class="col-md-6">
             <form role="form"">
               <div class="form-group">
                 <label>Show</label>
                 </br>
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custShowXAxis">Sparkline X Axis</input>
                 </label>
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="custShowYAxis">Sparkline Y Axis</input>
                 </label>
               </div>
             </form>
           </div>
           <div class="col-md-3">
           <form role="form" >
             <div class="form-group">
               <label>Chart Height</label>
               </br>
               <input style="height:25px; width:60px;" type="number" ng-model="custChartHeight"></input>
             </div>
           </form>
           </div>
           <div class="col-md-3">
             <button ng-click="addDataPoint()">Add Data Point</button>
           </div>
         </div>
         <div class="row">
           <div class="col-md-6">
             <form role="form"">
               <div class="form-group">
                 <label class="checkbox-inline">
                   <input type="checkbox" ng-model="data.dataAvailable" ng-change="updateDataAvailable()">Data Available</input>
                 </label>
               </div>
             </form>
         </div>
       </div>
     </div>
   </file>

   <file name="script.js">
   angular.module( 'patternfly.charts' ).controller( 'ChartCtrl', function( $scope ) {
     $scope.config = {
       title: 'Memory',
       units: 'GB'
     };
     $scope.donutConfig = {
       chartId: 'chartA',
       thresholds: {'warning':'60','error':'90'}
     };
     $scope.sparklineConfig = {
       'chartId': 'exampleSparkline',
       'tooltipType': 'default',
       'units': 'GB'
     };

    var today = new Date();
    var dates = ['dates'];
    for (var d = 20 - 1; d >= 0; d--) {
        dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
    }

     $scope.data = {
         dataAvailable: true,
         used: 76,
         total: 100,
         xData: dates,
         yData: ['used', '10', '20', '30', '20', '30', '10', '14', '20', '25', '68', '54', '56', '78', '56', '67', '88', '76', '65', '87', '76']
     };

     $scope.centerLabel = 'used';

     $scope.custShowXAxis = false;
     $scope.custShowYAxis = false;
     $scope.custChartHeight = 60;

     $scope.addDataPoint = function () {
       var newData = Math.round(Math.random() * 100);
       var newDate = new Date($scope.data.xData[$scope.data.xData.length - 1].getTime() + (24 * 60 * 60 * 1000));

       $scope.data.used = newData;
       $scope.data.xData.push(newDate);
       $scope.data.yData.push(newData);
     };
   });
   </file>
 </example>
 */
angular.module('patternfly.charts').component('pfUtilizationTrendChart', {
  bindings: {
    chartData: '<',
    config: '<',
    centerLabel: '<?',
    donutConfig: '<',
    sparklineConfig: '<',
    sparklineChartHeight: '<?',
    showSparklineXAxis: '<?',
    showSparklineYAxis: '<?'
  },
  templateUrl: 'charts/utilization-trend/utilization-trend-chart.html',
  controller: ["pfUtils", function (pfUtils) {
    'use strict';
    var ctrl = this, prevChartData, prevConfig;

    ctrl.updateAll = function () {
      // Need to deep watch changes
      prevChartData = angular.copy(ctrl.chartData);
      prevConfig = angular.copy(ctrl.config);

      if (ctrl.centerLabel === undefined) {
        ctrl.centerLabel = 'used';

      }

      if (ctrl.donutConfig.units === undefined) {
        ctrl.donutConfig.units = ctrl.config.units;
      }

      if (ctrl.chartData.available === undefined) {
        ctrl.chartData.available = ctrl.chartData.total - ctrl.chartData.used;
      }

      ctrl.config.units = ctrl.config.units || ctrl.units;

      if (ctrl.centerLabel === 'available') {
        ctrl.currentValue = ctrl.chartData.used;
        ctrl.currentText = 'Used';
      } else {
        ctrl.currentValue = ctrl.chartData.total - ctrl.chartData.used;
        ctrl.currentText = 'Available';
      }
    };

    ctrl.$onChanges = function (changesObj) {
      ctrl.updateAll();
    };

    ctrl.$doCheck = function () {
      // do a deep compare on chartData and config
      if (!angular.equals(ctrl.chartData, prevChartData) || !angular.equals(ctrl.config, prevConfig)) {
        ctrl.updateAll();
      }
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.filters.component:pfFilter
 * @restrict E
 *
 * @description
 *   Component for a filter bar
 *   <br><br>
 *
 * @param {object} config configuration settings for the filters:<br/>
 * <ul style='list-style-type: none'>
 * <li>.fields          - (Array) List of filterable fields containing:
 * <ul style='list-style-type: none'>
 * <li>.id          - (String) Optional unique Id for the filter field, useful for comparisons
 * <li>.title       - (String) The title to display for the filter field
 * <li>.placeholder - (String) Text to display when no filter value has been entered
 * <li>.filterType  - (String) The filter input field type (any html input type, or 'select' for a single select box)
 * <li>.filterValues - (Array) List of valid select values used when filterType is 'select'
 * </ul>
 * <li>.appliedFilters - (Array) List of the currently applied filters
 * <li>.resultsCount   - (int) The number of results returned after the current applied filters have been applied
 * <li>.onFilterChange - ( function(array of filters) ) Function to call when the applied filters list changes
 * </ul>
 *
 * @example
<example module="patternfly.filters">
  <file name="index.html">
    <div ng-controller="ViewCtrl" class="row example-container">
      <div class="col-md-12">
        <pf-filter id="exampleFilter" config="filterConfig"></pf-filter>
      </div>
      <hr class="col-md-12">
      <div class="col-md-12">
        <label class="events-label">Valid Items: </label>
      </div>
      <div class="col-md-12">
        <div ng-repeat="item in items" class="col-md-12 cfme-row-column">
          <div class="row">
            <div class="col-md-3">
              <span>{{item.name}}</span>
            </div>
            <div class="col-md-7">
              <span>{{item.address}}</span>
            </div>
            <div class="col-md-2">
              <span>{{item.birthMonth}}</span>
            </div>
          </div>
        </div>
      </div>
      </br></br>
      <div class="col-md-12">
        <label class="events-label">Current Filters: </label>
      </div>
      <div class="col-md-12">
        <textarea rows="5" class="col-md-12">{{filtersText}}</textarea>
      </div>
    </div>
  </file>

  <file name="script.js">
    angular.module('patternfly.filters').controller('ViewCtrl', ['$scope',
      function ($scope) {
        $scope.filtersText = '';

        $scope.allItems = [
          {
            name: "Fred Flintstone",
            address: "20 Dinosaur Way, Bedrock, Washingstone",
            birthMonth: 'February'
          },
          {
            name: "John Smith",
            address: "415 East Main Street, Norfolk, Virginia",
            birthMonth: 'October'
          },
          {
            name: "Frank Livingston",
            address: "234 Elm Street, Pittsburgh, Pennsylvania",
            birthMonth: 'March'
          },
          {
            name: "Judy Green",
            address: "2 Apple Boulevard, Cincinatti, Ohio",
            birthMonth: 'December'
          },
          {
            name: "Pat Thomas",
            address: "50 Second Street, New York, New York",
            birthMonth: 'February'
          }
        ];
        $scope.items = $scope.allItems;

        var matchesFilter = function (item, filter) {
          var match = true;
          var re = new RegExp(filter.value, 'i');

          if (filter.id === 'name') {
            match = item.name.match(re) !== null;
          } else if (filter.id === 'address') {
            match = item.address.match(re) !== null;
          } else if (filter.id === 'birthMonth') {
            match = item.birthMonth === filter.value;
          }
          return match;
        };

        var matchesFilters = function (item, filters) {
          var matches = true;

          filters.forEach(function(filter) {
            if (!matchesFilter(item, filter)) {
              matches = false;
              return false;
            }
          });
          return matches;
        };

        var applyFilters = function (filters) {
          $scope.items = [];
          if (filters && filters.length > 0) {
            $scope.allItems.forEach(function (item) {
              if (matchesFilters(item, filters)) {
                $scope.items.push(item);
              }
            });
          } else {
            $scope.items = $scope.allItems;
          }
          $scope.filterConfig.resultsCount = $scope.items.length;
        };

        var filterChange = function (filters) {
        $scope.filtersText = "";
          filters.forEach(function (filter) {
            $scope.filtersText += filter.title + " : " + filter.value + "\n";
          });
          applyFilters(filters);
        };

        $scope.filterConfig = {
          fields: [
            {
              id: 'name',
              title:  'Name',
              placeholder: 'Filter by Name',
              filterType: 'text'
            },
            {
              id: 'address',
              title:  'Address',
              placeholder: 'Filter by Address',
              filterType: 'text'
            },
            {
              id: 'birthMonth',
              title:  'Birth Month',
              placeholder: 'Filter by Birth Month',
              filterType: 'select',
              filterValues: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            }
          ],
          resultsCount: $scope.items.length,
          appliedFilters: [],
          onFilterChange: filterChange
        };
      }
    ]);
  </file>
</example>
*/
;angular.module('patternfly.filters').component('pfFilter', {
  bindings: {
    config: '='
  },
  templateUrl: 'filters/filter.html',
  controller: function () {
    'use strict';

    var ctrl = this;

    ctrl.$onInit = function () {

      angular.extend(ctrl,
        {
          addFilter: addFilter
        }
      );
    };

    function filterExists (filter) {
      var foundFilter = _.find(ctrl.config.appliedFilters, {title: filter.title, value: filter.value});
      return foundFilter !== undefined;
    }

    function enforceSingleSelect (filter) {
      _.remove(ctrl.config.appliedFilters, {title: filter.title});
    }

    function addFilter (field, value) {
      var newFilter = {
        id: field.id,
        title: field.title,
        type: field.filterType,
        value: value
      };
      if (!filterExists(newFilter)) {

        if (newFilter.type === 'select') {
          enforceSingleSelect(newFilter);
        }

        ctrl.config.appliedFilters.push(newFilter);

        if (ctrl.config.onFilterChange) {
          ctrl.config.onFilterChange(ctrl.config.appliedFilters);
        }
      }
    }
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.filters.component:pfFilterFields
 * @restrict E
 *
 * @description
 *   Directive for the filter bar's filter entry components
 *   <br><br>
 *
 * @param {object} config configuration settings for the filters:<br/>
 * <ul style='list-style-type: none'>
 * <li>.fields          - (Array) List of filterable fields containing:
 * <ul style='list-style-type: none'>
 * <li>.id          - (String) Optional unique Id for the filter field, useful for comparisons
 * <li>.title       - (String) The title to display for the filter field
 * <li>.placeholder - (String) Text to display when no filter value has been entered
 * <li>.filterType  - (String) The filter input field type (any html input type, or 'select' for a select box)
 * <li>.filterValues - (Array) List of valid select values used when filterType is 'select'
 * </ul>
 * <li>.appliedFilters - (Array) List of the currently applied filters
 * </ul>
 *
 */
angular.module('patternfly.filters').component('pfFilterFields', {
  bindings: {
    config: '=',
    addFilterFn: '<'
  },
  templateUrl: 'filters/filter-fields.html',
  controller: function () {
    'use strict';

    var ctrl = this;
    var prevConfig;

    ctrl.$onInit = function () {
      angular.extend(ctrl, {
        selectField: selectField,
        selectValue: selectValue,
        onValueKeyPress: onValueKeyPress
      });
    };

    ctrl.$onChanges = function () {
      setupConfig ();
    };

    ctrl.$doCheck = function () {
      // do a deep compare on config
      if (!angular.equals(ctrl.config, prevConfig)) {
        setupConfig();
      }
    };

    function selectField (item) {
      ctrl.currentField = item;
      ctrl.currentValue = null;
    }

    function selectValue (filterValue) {
      if (angular.isDefined(filterValue)) {
        ctrl.addFilterFn(ctrl.currentField, filterValue);
        ctrl.currentValue = null;
      }
    }

    function onValueKeyPress (keyEvent) {
      if (keyEvent.which === 13) {
        ctrl.addFilterFn(ctrl.currentField, ctrl.currentValue);
        ctrl.currentValue = undefined;
      }
    }

    function setupConfig () {
      var fieldFound = false;

      prevConfig = angular.copy(ctrl.config);

      if (ctrl.config.fields === undefined) {
        ctrl.config.fields = [];
      }

      if (ctrl.currentField) {
        fieldFound = _.find(ctrl.config.fields, function (nextField) {
          return nextField.id === ctrl.currentField.id;
        });
      }

      if (!fieldFound) {
        ctrl.currentField = ctrl.config.fields[0];
        ctrl.currentValue = null;
      }

      if (ctrl.currentValue === undefined) {
        ctrl.currentValue = null;
      }
    }
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.filters.component:pfFilterResults
 * @restrict E
 *
 * @description
 *   Component for the filter results
 *   <br><br>
 *
 * @param {object} config configuration settings for the filter results:<br/>
 * <ul style='list-style-type: none'>
 * <li>.fields          - (Array) List of filterable fields containing:
 * <ul style='list-style-type: none'>
 * <li>.id          - (String) Optional unique Id for the filter field, useful for comparisons
 * <li>.title       - (String) The title to display for the filter field
 * <li>.placeholder - (String) Text to display when no filter value has been entered
 * <li>.filterType  - (String) The filter input field type (any html input type, or 'select' for a select box)
 * <li>.filterValues - (Array) List of valid select values used when filterType is 'select'
 * </ul>
 * <li>.appliedFilters - (Array) List of the currently applied filters
 * <li>.resultsCount   - (int) The number of results returned after the current applied filters have been applied
 * <li>.selectedCount  - (int) The number selected items, The 'n' in the label: 'n' of 'm' selected
 * <li>.totalCount     - (int) The total number of items before any filters have been applied. The 'm' in the label: 'n' of 'm' selected
 * <li>.onFilterChange - ( function(array of filters) ) Function to call when the applied filters list changes
 * </ul>
 *
 */
angular.module('patternfly.filters').component('pfFilterResults', {
  bindings: {
    config: '='
  },
  templateUrl: 'filters/filter-results.html',
  controller: function () {
    'use strict';

    var ctrl = this;
    var prevConfig;

    ctrl.$onInit = function () {
      angular.extend(ctrl, {
        clearFilter: clearFilter,
        clearAllFilters: clearAllFilters
      });
    };

    ctrl.$onChanges = function () {
      setupConfig ();
    };

    ctrl.$doCheck = function () {
      // do a deep compare on config
      if (!angular.equals(ctrl.config, prevConfig)) {
//        setupConfig();
      }
    };

    function setupConfig () {
      prevConfig = angular.copy(ctrl.config);

      if (!ctrl.config.appliedFilters) {
        ctrl.config.appliedFilters = [];
      }
      if (ctrl.config.resultsCount === undefined) {
        ctrl.config.resultsCount = 0;
      }
    }

    function clearFilter (item) {
      var newFilters = [];
      ctrl.config.appliedFilters.forEach(function (filter) {
        if (item.title !== filter.title || item.value !== filter.value) {
          newFilters.push(filter);
        }
      });
      ctrl.config.appliedFilters = newFilters;

      if (ctrl.config.onFilterChange) {
        ctrl.config.onFilterChange(ctrl.config.appliedFilters);
      }
    }

    function clearAllFilters () {
      ctrl.config.appliedFilters = [];

      if (ctrl.config.onFilterChange) {
        ctrl.config.onFilterChange(ctrl.config.appliedFilters);
      }
    }
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.form.component:pfFormButtons
 * @restrict E
 *
 * @description
 *   Encapsulates the standard structure and styling for create and cancel buttons
 *   when used with a form.
 *
 *   This directive creates new scope.
 *
 * @param {function} pfHandleCancel function to call when the user clicks cancel.
 * @param {function} pfHandleSave function to call when the user clicks save.
 * @param {expression} pfWorking the model to store the working status in.
 * @param {string} pfButtonClass the class of the button container.
 *
 * @example
 <example module="patternfly.form">

   <file name="index.html">
     <div ng-controller="FormButtonCtrl">
       <p>Saved?</p>
       <p>{{ status }}</p>
       <form name="testForm">
         <div class="form-group>
           <label class="control-label col-sm-2">Input</label>
           <input class="form-control col-sm-5" name="item" ng-model="input" type="text" required>
         </div>
         <pf-form-buttons pf-on-cancel="cancel()" pf-on-save="save(item)" pf-working="working"></pf-form-buttons>
       </form>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.form' ).controller( 'FormButtonCtrl', function( $scope, $timeout, $element ) {
       $scope.status = 'Not yet Saved'
       $scope.working = false;

       $scope.save = function (item) {
         $scope.status = 'saved';
         $scope.working = true;

         $timeout(function () {
           $scope.working = false;
         }, 1000);
       };

       $scope.cancel = function () {
         $scope.status = 'cancelled';
         $scope.input = null;
       };
     });
   </file>
 </example>
 */
;/**
 * @ngdoc directive
 * @name patternfly.form.directive:pfFormGroup
 * @restrict E
 *
 * @description
 *  Encapsulates the structure and styling for a label + input used within a
 *  Bootstrap3 based form.
 *
 *  This directive creates new scope.
 *
 * @param {string} pfLabel the text for the <label> element.
 * @param {string} pfFieldId the id of the form field. Default value is id of the form field element.
 * @param {string} pfLabelClass the class of the label element. Default value is "col-sm-2".
 * @param {string} pfInputClass the class of the input element. Default value is "col-sm-5".
 *
 * @example
 <example module="patternfly.form">

   <file name="index.html">
     <div ng-controller="FormDemoCtrl">
       <p>Name: {{ item.name }}</p>
       <p>Description: {{ item.description }}</p>
       <form>
         <pf-form-group pf-label="Name" required>
           <input id="name" name="name" ng-model="item.name" type="text" required/>
         </pf-form-group>
         <pf-form-group pf-label="Description">
           <textarea id="description" name="description" ng-model="item.description">
             {{ item.description }}
           </textarea>
         </pf-form-group>
       </form>
       <p>Horizontal Form</p>
       <form class="form-horizontal">
         <pf-form-group pf-label="Name" required pf-label-class="col-sm-2" pf-input-class="col-sm-5">
           <input id="name" name="name" ng-model="item.name" type="text" required/>
         </pf-form-group>
         <pf-form-group pf-label="Description" pf-label-class="col-sm-2" pf-input-class="col-sm-5">
           <textarea id="description" name="description" ng-model="item.description">
             {{ item.description }}
           </textarea>
         </pf-form-group>
       </form>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.form' ).controller( 'FormDemoCtrl', function( $scope ) {
       $scope.item = {
         name: 'Homer Simpson',
         description: 'I like donuts and Duff.  Doh!'
       };
     });
   </file>
 </example>
*/
;/**
 * @ngdoc directive
 * @name patternfly.form.directive:pfRemainingCharsCount
 *
 * @description
 *   Directive for showing a characters remaining count and triggering warning and error</br>
 *   behavior when passing specified thresholds.  When the <code>chars-warn-remaining</code> threshold is passed, </br>
 *   the <code>chars-warn-remaining-pf</code> css class is applied to the <code>count-fld</code>, which by default, turns </br>
 *   the remaining count number <font color='red'>red</font>.</br>
 *   By default, characters may be entered into the text field after the <code>chars-max-limit</code> limit has been reached,</br>
 *   the remaining count number will become a negative value. Setting the <code>blockInputAtMaxLimit</code> to <em>true</em>,</br>
 *   will block additional input into the text field after the max has been reached; additionally a right-click 'paste' will only </br>
 *   paste characters until the maximum character limit is reached.
 *
 * @param {string} ng-model The scope model variable which contains the initial text for the text field.  Required, but</br>
 * can be an emptly string ("").
 * @param {string} count-fld The id of the field to display the 'characters-remaining' count.
 * @param {string} chars-max-limit Number representing the maximum number of characters to allow before dispatching a<br/>
 * 'overCharsMaxLimit' event.   When the number of characters falls below <code>chars-max-limit</code>, a 'underCharsMaxLimit'<br/>
 * event is dispatched.
 * @param {string} chars-warn-remaining Number of remaining characters to warn upon.  The 'chars-warn-remaining-pf'<br/>
 * class will be applied to the <code>count-fld</code> when the remaining characters is less than the<br/>
 * <code>chars-warn-remaining</code> threshold.  When/if the number of remaining characters becomes greater than the<br/>
 * <code>chars-warn-remaining</code> threshold, the 'chars-warn-remaining-pf' class is removed from the <code>count-fld</code> field.
 * @param {boolean=} block-input-at-max-limit If true, no more characters can be entered into the text field when the<br/>
 * <code>chars-max-limit</code> has been reached.  If false (the default), characters may be entered into the text field after the<br/>
 * max. limit has been reached, but these additional characters will trigger the 'overCharsMaxLimit' event to be<br/>
 * dispatched.  When <code>blockInputAtMaxLimit</code> is <em>true</em>, a right-click 'paste' will only paste<br/>
 * characters until the maximum character limit is reached.
 *
 * @example
 <example module="patternfly.example">
   <file name="index.html">
     <div ng-controller="DemoCtrl" style="display:inline-block; width: 100%;">

     <style>
       textarea {
         resize: none;
       }
     </style>

     <div class="container">
       <strong>Max limit: 20, warn when 5 or less remaining, disable button after max limit</strong>
       <div class="row">
         <div class="col-md-4">

           <form>
             <div class="form-group">
               <label for="messageArea"></label>
               <textarea class="form-control" pf-remaining-chars-count id="messageArea_1" ng-model="messageArea1text" chars-max-limit="20" chars-warn-remaining="5"
                         count-fld="charRemainingCntFld_1" name="text" placeholder="Type in your message" rows="5"></textarea>
             </div>
             <span class="pull-right chars-remaining-pf">
               <span id="charRemainingCntFld_1"></span>
               <button id="postBtn_1" ng-disabled="charsMaxLimitExceeded" type="submit" class="btn btn-default">Post New Message</button>
             </span>
           </form>

         </div>
       </div>
       <br>
       <strong>Max limit: 10, warn when 2 or less remaining, block input after max limit</strong>
       <div class="row">
         <div class="col-md-4">
          <form>
             <div class="form-group">
               <label for="messageArea"></label>
               <textarea class="form-control" pf-remaining-chars-count id="messageArea_2" ng-model="messageArea2text" chars-max-limit="10" chars-warn-remaining="2"
                         block-input-at-max-limit="true" count-fld="charRemainingCntFld_2" name="text"
                         placeholder="Type in your message" rows="5"></textarea>
             </div>
             <span class="pull-left">
               <button id="postBtn_2" type="submit" class="btn btn-default">Submit</button>
             </span>
             <span class="pull-right chars-remaining-pf">
               <span id="charRemainingCntFld_2"></span>
             </span>
           </form>
         </div>
       </div>
       <br>
       <strong>Max limit: 10, warn when 5 or less remaining, block input after max limit</strong>
       <div class="row">
         <div class="col-md-4">
           <input id="input_3" pf-remaining-chars-count chars-max-limit="10" ng-model="messageInput3text" chars-warn-remaining="5" count-fld="charRemainingCntFld_3"
             block-input-at-max-limit="true"/>
             <span class="chars-remaining-pf"><span id="charRemainingCntFld_3" style="padding-left: 5px"></span>Remaining</span>
         </div>
       </div>
     </div>
   </file>

   <file name="script.js">
   angular.module( 'patternfly.example', ['patternfly.form']);

   angular.module( 'patternfly.example' ).controller( 'DemoCtrl', function( $scope ) {
     $scope.messageArea1text = "Initial Text";
     $scope.messageArea2text = "";
     $scope.messageInput3text = "";

     $scope.charsMaxLimitExceeded = false;

     // 'tfId' will equal the id of the text area/input field which
     // triggered the event
     $scope.$on('overCharsMaxLimit', function (event, tfId) {
         if(!$scope.charsMaxLimitExceeded){
           $scope.charsMaxLimitExceeded = true;
         }
     });

     // 'tfId' will equal the id of the text area/input field which
     // triggered the event
     $scope.$on('underCharsMaxLimit', function (event, tfId) {
         if($scope.charsMaxLimitExceeded){
           $scope.charsMaxLimitExceeded = false;
         }
     });

   });

   </file>
 </example>
*/
;angular.module('patternfly.form').component('pfFormButtons', {

  bindings: {
    pfHandleCancel: '&pfOnCancel',
    pfHandleSave: '&pfOnSave',
    pfWorking: '=',
    pfButtonContainerClass: '@'
  },
  require: {
    form: '^form'
  },
  templateUrl: 'form/form-buttons/form-buttons.html',
  controller: function () {
    'use strict';

    var ctrl = this;

    ctrl.$onInit = function () {
      if (ctrl.pfWorking === undefined) {
        ctrl.pfWorking = false;
      }

      angular.extend(ctrl, {
        isInvalid: isInvalid
      });
    };

    function isInvalid () {
      var invalid = ctrl.form.$invalid;

      if (ctrl.form && ctrl.form.name && ctrl.form.name.$error) {
        if (ctrl.form.name.$error.server) {
          invalid = false;
        }
      }

      return invalid;
    }
  }
});
;angular.module('patternfly.form').component('pfFormGroup', {

  bindings: {
    pfLabel: '@',
    pfField: '@',
    pfLabelClass: '@',
    pfInputClass: '@'

  },
  require: {
    form: '^form'
  },
  transclude: true,
  templateUrl: 'form/form-group/form-group.html',

  controller: ["$element", function ($element) {
    'use strict';

    var ctrl = this;

    ctrl.$onInit = function () {
      angular.extend(ctrl, {
        hasErrors: hasErrors
      });
    };

    ctrl.$postLink = function () {
      var input = getInput($element);
      var type = input.attr('type');

      if (['checkbox', 'radio', 'time'].indexOf(type) === -1) {
        input.addClass('form-control');
      }

      if (!ctrl.pfField) {
        ctrl.pfField = input.attr('id');
      }

      if (input.attr('required')) {
        $element.addClass('required');
      }

      if (ctrl.form[ctrl.pfField]) {
        ctrl.error = ctrl.form[ctrl.pfField].$error;
      }
    };

    function hasErrors () {
      return ctrl.form[ctrl.pfField] && ctrl.form[ctrl.pfField].$invalid && ctrl.form[ctrl.pfField].$dirty;
    }

    function getInput (element) {
      // table is used for bootstrap3 date/time pickers
      var input = element.find('table');

      if (input.length === 0) {
        input = element.find('input');

        if (input.length === 0) {
          input = element.find('select');

          if (input.length === 0) {
            input = element.find('textarea');
          }
        }
      }
      return input;
    }
  }]
});
;angular.module('patternfly.form').directive('pfRemainingCharsCount', ["$timeout", function ($timeout) {
  'use strict';
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: "="
    },
    link: function ($scope, $element, $attributes) {
      var charsMaxLimit = $attributes.charsMaxLimit;
      var charsWarnRemaining = $attributes.charsWarnRemaining;
      var countRemainingFld = angular.element(document.getElementById($attributes.countFld));
      var blockInputAtMaxLimit = ($attributes.blockInputAtMaxLimit === 'true');
      var checkCharactersRemaining = function () {
        var charsLength = $scope.ngModel.length;
        var remainingChars = charsMaxLimit - charsLength;

        // trim if blockInputAtMaxLimit and over limit
        if (blockInputAtMaxLimit && charsLength > charsMaxLimit) {
          $scope.ngModel = $scope.ngModel.substring(0, charsMaxLimit);
          charsLength = $scope.ngModel.length;
          remainingChars = charsMaxLimit - charsLength;
        }

        // creating scope vars for unit testing
        $scope.remainingChars = remainingChars;
        $scope.remainingCharsWarning = (remainingChars <= charsWarnRemaining ? true : false);

        countRemainingFld.text(remainingChars);
        countRemainingFld.toggleClass('chars-warn-remaining-pf', remainingChars <= charsWarnRemaining);

        if (remainingChars < 0) {
          $scope.$emit('overCharsMaxLimit', $attributes.id);
        } else {
          $scope.$emit('underCharsMaxLimit', $attributes.id);
        }
      };

      $scope.$watch('ngModel', function () {
        checkCharactersRemaining();
      });

      $element.on('keypress', function (event) {
        // Once the charsMaxLimit has been met or exceeded, prevent all keypresses from working
        if (blockInputAtMaxLimit && $element.val().length >= charsMaxLimit) {
          // Except backspace
          if (event.keyCode !== 8) {
            event.preventDefault();
          }
        }
      });
    }
  };
}]);
;/**
 * @ngdoc directive
 * @name patternfly.modals.component:pfAboutModal
 * @restrict E
 *
 * @description
 * Component for rendering modal windows.
 *
 * @param {string=} additionalInfo Text explaining the version or copyright
 * @param {string=} copyright Product copyright information
 * @param {string=} imgAlt The alt text for the corner grahpic
 * @param {string=} imgSrc The source for the corner grahpic
 * @param {boolean=} isOpen Flag indicating that the modal should be opened
 * @param {function=} onClose Function to call when modal is closed
 * @param {object=} productInfo data for the modal:<br/>
 * <ul style='list-style-type: none'>
 * <li>.product - the product label
 * <li>.version - the product version
 * </ul>
 * @param {string=} title The product title for the modal
 *
 * @example
 <example module="patternfly.modals">
   <file name="index.html">
     <div ng-controller="ModalCtrl">
       <button ng-click="open()" class="btn btn-default">Launch About Modal</button>
       <pf-about-modal is-open="isOpen" on-close="onClose()" additional-info="additionalInfo"
            product-info="productInfo" title="title" copyright="copyright" img-alt="imgAlt" img-src="imgSrc"></pf-about-modal>
     </div>
   </file>
   <file name="script.js">
     angular.module('patternfly.modals').controller('ModalCtrl', function ($scope) {
       $scope.additionalInfo = "Donec consequat dignissim neque, sed suscipit quam egestas in. Fusce bibendum " +
         "laoreet lectus commodo interdum. Vestibulum odio ipsum, tristique et ante vel, iaculis placerat nulla. " +
         "Suspendisse iaculis urna feugiat lorem semper, ut iaculis risus tempus.";
       $scope.copyright = "Trademark and Copyright Information";
       $scope.imgAlt = "Patternfly Symbol";
       $scope.imgSrc = "img/logo-alt.svg";
       $scope.title = "Product Title";
       $scope.productInfo = [
         { name: 'Version', value: '1.0.0.0.20160819142038_51be77c' },
         { name: 'Server Name', value: 'Localhost' },
         { name: 'User Name', value: 'admin' },
         { name: 'User Role', value: 'Administrator' }];
       $scope.open = function () {
         $scope.isOpen = true;
       }
       $scope.onClose = function() {
         $scope.isOpen = false;
       }
     });
   </file>
 </example>
 */
angular.module('patternfly.modals')

.directive("pfAboutModalTransclude", ["$parse", function ($parse) {
  'use strict';
  return {
    link: function (scope, element, attrs) {
      element.append($parse(attrs.pfAboutModalTransclude)(scope));
    }
  };
}])
.component('pfModalContent', {
  templateUrl: 'about-modal-template.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    'use strict';
    var $ctrl = this;

    $ctrl.$onInit = function () {
      $ctrl.additionalInfo = $ctrl.resolve.additionalInfo;
      $ctrl.copyright = $ctrl.resolve.copyright;
      $ctrl.imgAlt = $ctrl.resolve.imgAlt;
      $ctrl.imgSrc = $ctrl.resolve.imgSrc;
      $ctrl.isOpen = $ctrl.resolve.isOpen;
      $ctrl.productInfo = $ctrl.resolve.productInfo;
      $ctrl.title = $ctrl.resolve.title;
      $ctrl.template = $ctrl.resolve.content;
    };
  }
})
.component('pfAboutModal', {
  bindings: {
    additionalInfo: '=?',
    copyright: '=?',
    close: "&onClose",
    imgAlt: '=?',
    imgSrc: '=?',
    isOpen: '<?',
    productInfo: '=',
    title: '=?'
  },
  templateUrl: 'modals/about-modal.html',
  transclude: true,
  controller: ["$uibModal", "$transclude", function ($uibModal, $transclude) { //$uibModal, $transclude, $window
    'use strict';
    var ctrl = this;

    // The ui-bootstrap modal only supports either template or templateUrl as a way to specify the content.
    // When the content is retrieved, it is compiled and linked against the provided scope by the $uibModal service.
    // Unfortunately, there is no way to provide transclusion there.
    //
    // The solution below embeds a placeholder directive (i.e., pfAboutModalTransclude) to append the transcluded DOM.
    // The transcluded DOM is from a different location than the modal, so it needs to be handed over to the
    // placeholder directive. Thus, we're passing the actual DOM, not the parsed HTML.
    ctrl.openModal = function () {
      //$window.console.log('hi mom');
      $uibModal.open({
        component: 'pfModalContent',
        resolve: {
          content: function () {
            var transcludedContent;
            $transclude(function (clone) {
              transcludedContent = clone;
            });
            return transcludedContent;
          },
          additionalInfo: function () {
            return ctrl.additionalInfo;
          },
          copyright: function () {
            return ctrl.copyright;
          },
          close: function () {
            return ctrl.close;
          },
          imgAlt: function () {
            return ctrl.imgAlt;
          },
          imgSrc: function () {
            return ctrl.imgSrc;
          },
          isOpen: function () {
            return ctrl.isOpen;
          },
          productInfo: function () {
            return ctrl.productInfo;
          },
          title: function () {
            return ctrl.title;
          }
        }
      })
        .result.then(
        function () {
          ctrl.close(); // closed
        },
        function () {
          ctrl.close(); // dismissed
        }
      );
    };
    ctrl.$onInit = function () {
      if (ctrl.isOpen === undefined) {
        ctrl.isOpen = false;
      }
    };

    ctrl.$onChanges = function (changesObj) {
      if (changesObj.isOpen && changesObj.isOpen.currentValue === true) {
        ctrl.openModal();
      }
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.navigation.component:pfApplicationLauncher
 * @restrict E
 *
 * @description
 * Component for rendering application launcher dropdown.
 *
 * @param {string=} label Use a custom label for the launcher, default: Application Launcher
 * @param {boolean=} isDisabled Disable the application launcher button, default: false
 * @param {boolean=} isList Display items as a list instead of a grid, default: false
 * @param {boolean=} hiddenIcons Flag to not show icons on the launcher, default: false
 * @param {array} items List of navigation items
 * <ul style='list-style-type: none'>
 * <li>.title        - (string) Name of item to be displayed on the menu
 * <li>.iconClass    - (string) Classes for icon to be shown on the menu (ex. "fa fa-dashboard")
 * <li>.href         - (string) href link to navigate to on click
 * <li>.tooltip      - (string) Tooltip to display for the badge
 * </ul>
 * @example
 <example module="patternfly.navigation">
 <file name="index.html">
   <div ng-controller="applicationLauncherController" class="row">
     <div class="col-xs-12 pre-demo-text">
       <label>Click the launcher indicator to show the Application Launcher Dropdown:</label>
     </div>
     <nav class="navbar navbar-pf navbar-collapse">
       <ul class="nav navbar-left">
         <li>
           <pf-application-launcher items="navigationItems" label="{{label}}" is-disabled="isDisabled" is-list="isList" hidden-icons="hiddenIcons"></pf-application-launcher>
         </li>
       </ul>
     </nav>
   </div>
 </file>
 <file name="script.js">
   angular.module('patternfly.navigation').controller('applicationLauncherController', ['$scope',
     function ($scope) {
       $scope.navigationItems = [
         {
           title: "Recteque",
           href: "#/ipsum/intellegam/recteque",
           tooltip: "Launch the Function User Interface",
           iconClass: "pficon-storage-domain"
         },
         {
           title: "Suavitate",
           href: "#/ipsum/intellegam/suavitate",
           tooltip: "Launch the Function User Interface",
           iconClass: "pficon-build"
         },
         {
           title: "Lorem",
           href: "#/ipsum/intellegam/lorem",
           tooltip: "Launch the Function User Interface",
           iconClass: "pficon-domain"
         },
         {
           title: "Home",
           href: "#/ipsum/intellegam/home",
           tooltip: "Launch the Function User Interface",
           iconClass: "pficon-home"
         }
       ];

       $scope.label = 'Application Launcher';
       $scope.isDisabled = false;
       $scope.isList = false;
       $scope.hiddenIcons = false;
     }]);
 </file>
 </example>
 */
angular.module('patternfly.navigation').component('pfApplicationLauncher', {
  bindings: {
    items: '<',
    label: '@?',
    isDisabled: '<?',
    isList: '<?',
    hiddenIcons: '<?'
  },
  templateUrl: 'navigation/application-launcher.html',
  controller: ["$scope", function ($scope) {
    'use strict';
    var ctrl = this;

    ctrl.$id = $scope.$id;
  }]
});

;/**
 * @ngdoc directive
 * @name patternfly.navigation.component:pfVerticalNavigation - Basic
 * @restrict E
 *
 * @description
 *   Component for vertical navigation. This sets up the nav bar header with the collapse button (hamburger) and the
 *   application brand image (or text) as well as the vertical navigation bar containing the navigation items. This
 *   directive supports primary, secondary, and tertiary navigation with options to allow pinning of the secondary and
 *   tertiary navigation menus as well as the option for persistent secondary menus.
 *   <br><br>
 *   The remaining parts of the navbar header can be transcluded.
 *   <br><br>
 *   Tha navigation items are marked active based on the current location and the href value for the item. If not using
 *   href's on the items to navigate, set update-active-items-on-click to "true".
 *   <br><br>
 *   This directive works in conjunction with the main content container if the 'container-pf-nav-pf-vertical' class
 *   selector is added to the main content container.
 *
 * @param {string} brandSrc src for brand image
 * @param {string} brandAlt  Text for product name when brand image is not available
 * @param {boolean} showBadges Flag if badges are used on navigation items, default: false
 * @param {boolean} persistentSecondary Flag to use persistent secondary menus, default: false
 * @param {boolean} hiddenIcons Flag to not show icons on the primary menu, default: false
 * @param {array} items List of navigation items
 * <ul style='list-style-type: none'>
 * <li>.title          - (string) Name of item to be displayed on the menu
 * <li>.iconClass      - (string) Classes for icon to be shown on the menu (ex. "fa fa-dashboard")
 * <li>.href           - (string) href link to navigate to on click
 * <li>.children       - (array) Submenu items (same structure as top level items)
 * <li>.badges         -  (array) Badges to display for the item, badges with a zero count are not displayed.
 *   <ul style='list-style-type: none'>
 *   <li>.count        - (number) Count to display in the badge
 *   <li>.iconClass    - (string) Class to use for showing an icon before the count
 *   <li>.tooltip      - (string) Tooltip to display for the badge
 *   <li>.badgeClass:  - (string) Additional class(es) to add to the badge container
 *   </ul>
 * </ul>
 * @param {function} navigateCallback function(item) Callback method invoked on a navigation item click (one with no submenus)
 * @param {function} itemClickCallback function(item) Callback method invoked on an item click
 * @param {boolean} updateActiveItemsOnClick Flag if active items should be marked on click rather than on navigation change, default: false
 * @param {boolean} ignoreMobile Flag if mobile state should be ignored (use only if absolutely necessary) default: false
 *
 * @example
 <example module="patternfly.navigation" deps="patternfly.utils, patternfly.filters, patternfly.sort, patternfly.views">
  <file name="index.html">
  <div ng-controller="showDemoController">
    <button class="btn btn-primary" id="showVerticalNav" ng-click="showVerticalNav()">Show Vertical Navigation</button>
    <label class="example-info-text">This will display the vertical nav bar and some mock content over the content of this page.</label>
    <label class="example-info-text">Exit the demo to return back to this page.</label>
  </div>
  <div id="verticalNavLayout" class="layout-pf layout-pf-fixed faux-layout hidden" ng-controller="vertNavController">
    <pf-vertical-navigation items="navigationItems" brand-alt="ANGULAR PATTERNFLY"
         show-badges="true" pinnable-menus="true" update-active-items-on-click="true"
         navigate-callback="handleNavigateClick">
      <div>
        <ul class="nav navbar-nav">
          <li><button id="hideVerticalNav" ng-click="hideVerticalNav()" class="hide-vertical-nav">Exit Vertical Navigation Demo</button></li>
        </ul>
        <ul class="nav navbar-nav navbar-right navbar-iconic">
          <li class="dropdown">
          </li>
          <li class="dropdown">
            <a class="dropdown-toggle nav-item-iconic" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <span title="Help" class="fa pficon-help"></span>
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a href="#">Help</a></li>
              <li><a href="#">About</a></li>
            </ul>
          </li>
          <li class="dropdown">
            <a class="dropdown-toggle nav-item-iconic" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <span title="Username" class="fa pficon-user"></span>
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
              <li><a href="#">Preferences</a></li>
              <li><a href="#">Logout</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </pf-vertical-navigation>
    <div id="contentContainer" class="container-fluid container-cards-pf container-pf-nav-pf-vertical example-page-container">
      <div id="includedContent" ng-include="'add_content.html'"></div>
    </div>
  </div>
  </file>
  <file name="demo.js">
  angular.module('patternfly.navigation').controller('showDemoController', ['$scope',
   function ($scope) {
     $scope.showVerticalNav = function () {
       angular.element(document.querySelector("#verticalNavLayout")).removeClass("hidden");
     };
   }
  ]);
  </file>
  <file name="script.js">
  angular.module('patternfly.navigation').controller('vertNavController', ['$scope',
    function ($scope) {
      $scope.navigationItems = [
        {
           title: "Dashboard",
           iconClass: "fa fa-dashboard",
           href: "#/dashboard"
        },
        {
           title: "Dolor",
           iconClass : "fa fa-shield",
           href: "#/dolor",
           badges: [
             {
               count: 1283,
               tooltip: "Total number of items"
             }
           ]
        },
        {
           title: "Ipsum",
           iconClass: "fa fa-space-shuttle",
           children: [
              {
                 title: "Intellegam",
                 children: [
                    {
                       title: "Recteque",
                       href: "#/ipsum/intellegam/recteque",
                       badges: [
                         {
                           count: 6,
                           tooltip: "Total number of error items",
                           badgeClass: 'example-error-background'
                         }
                       ]
                    },
                    {
                       title: "Suavitate",
                       href: "#/ipsum/intellegam/suavitate",
                       badges: [
                         {
                           count: 2,
                           tooltip: "Total number of items"
                         }
                       ]
                    },
                    {
                       title: "Vituperatoribus",
                       href: "#/ipsum/intellegam/vituperatoribus",
                       badges: [
                         {
                           count: 18,
                           tooltip: "Total number of warning items",
                           badgeClass: 'example-warning-background'
                         }
                       ]
                    }
                 ]
              },
              {
                 title: "Copiosae",
                 children: [
                    {
                       title: "Exerci",
                       href: "#/ipsum/copiosae/exerci",
                       badges: [
                         {
                           count: 2,
                           tooltip: "Total number of error items",
                           iconClass: 'pficon pficon-error-circle-o'
                         },
                         {
                           count: 6,
                           tooltip: "Total number warning error items",
                           iconClass: 'pficon pficon-warning-triangle-o'
                         }
                       ]
                    },
                    {
                       title: "Quaeque",
                       href: "#/ipsum/copiosae/quaeque",
                       badges: [
                         {
                           count: 0,
                           tooltip: "Total number of error items",
                           iconClass: 'pficon pficon-error-circle-o'
                         },
                         {
                           count: 4,
                           tooltip: "Total number warning error items",
                           iconClass: 'pficon pficon-warning-triangle-o'
                         }
                       ]
                    },
                    {
                       title: "Utroque",
                       href: "#/ipsum/copiosae/utroque",
                       badges: [
                         {
                           count: 1,
                           tooltip: "Total number of error items",
                           iconClass: 'pficon pficon-error-circle-o'
                         },
                         {
                           count: 2,
                           tooltip: "Total number warning error items",
                           iconClass: 'pficon pficon-warning-triangle-o'
                         }
                       ]
                    }
                 ]
              },
              {
                 title: "Patrioque",
                 children: [
                    {
                       title: "Novum",
                       href: "#/ipsum/patrioque/novum"
                    },
                    {
                       title: "Pericula",
                       href: "#/ipsum/patrioque/pericula"
                    },
                    {
                       title: "Gubergren",
                       href: "#/ipsum/patrioque/gubergren"
                    }
                 ]
              },
              {
                 title: "Accumsan",
                 href: "#/ipsum/Accumsan",
                 badges: [
                   {
                     count: 2,
                     tooltip: "Total number of error items",
                     iconClass: 'pficon pficon-error-circle-o'
                   },
                   {
                     count: 6,
                     tooltip: "Total number warning error items",
                     iconClass: 'pficon pficon-warning-triangle-o'
                   }
                 ]
              }
           ]
        },
        {
           title: "Amet",
           iconClass: "fa fa-paper-plane",
           children: [
              {
                 title: "Detracto",
                 children: [
                    {
                       title: "Delicatissimi",
                       href: "#/amet/detracto/delicatissimi"
                    },
                    {
                       title: "Aliquam",
                       href: "#/amet/detracto/aliquam"
                    },
                    {
                       title: "Principes",
                       href: "#/amet/detracto/principes"
                    }
                 ]
              },
              {
                 title: "Mediocrem",
                 children: [
                    {
                       title: "Convenire",
                       href: "#/amet/mediocrem/convenire"
                    },
                    {
                       title: "Nonumy",
                       href: "#/amet/mediocrem/nonumy"
                    },
                    {
                       title: "Deserunt",
                       href: "#/amet/mediocrem/deserunt"
                    }
                 ]
              },
              {
                 title: "Corrumpit",
                 children: [
                    {
                       title: "Aeque",
                       href: "#/amet/corrumpit/aeque"
                    },
                    {
                       title: "Delenit",
                       href: "#/amet/corrumpit/delenit"
                    },
                    {
                       title: "Qualisque",
                       href: "#/amet/corrumpit/qualisque"
                    }
                 ]
              },
              {
                 title: "urbanitas",
                 href: "#/amet/urbanitas"
              }
           ]
        },
        {
           title: "Adipscing",
           iconClass: "fa fa-graduation-cap",
           href: "#/adipscing"
        },
        {
           title: "Lorem",
           iconClass: "fa fa-gamepad",
           href: "#/lorem"
        },
        {
           title: "Exit Demo"
        }
      ];
      $scope.hideVerticalNav = function () {
        angular.element(document.querySelector("#verticalNavLayout")).addClass("hidden");
      };
      $scope.handleNavigateClick = function (item) {
        if (item.title === "Exit Demo") {
          $scope.hideVerticalNav();
        }
      };
    }
  ]);
  </file>
  <file name="add_content.html">
    <div class="row row-cards-pf">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="card-pf card-pf-accented card-pf-aggregate-status" style="height: 89px;">
          <h2 class="card-pf-title" style="height: 17px;">
            <span class="fa fa-shield"></span><span class="card-pf-aggregate-status-count">0</span> Ipsum
          </h2>
          <div class="card-pf-body" style="height: 50px;">
            <p class="card-pf-aggregate-status-notifications">
              <span class="card-pf-aggregate-status-notification"><a href="#" class="add" data-toggle="tooltip" data-placement="top" title="Add Ipsum"><span class="pficon pficon-add-circle-o"></span></a></span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="card-pf card-pf-accented card-pf-aggregate-status" style="height: 89px;">
          <h2 class="card-pf-title" style="height: 17px;">
            <a href="#"><span class="fa fa-shield"></span><span class="card-pf-aggregate-status-count">20</span> Amet</a>
          </h2>
          <div class="card-pf-body" style="height: 50px;">
            <p class="card-pf-aggregate-status-notifications">
              <span class="card-pf-aggregate-status-notification"><a href="#"><span class="pficon pficon-error-circle-o"></span>4</a></span>
              <span class="card-pf-aggregate-status-notification"><a href="#"><span class="pficon pficon-warning-triangle-o"></span>1</a></span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="card-pf card-pf-accented card-pf-aggregate-status" style="height: 89px;">
          <h2 class="card-pf-title" style="height: 17px;">
            <a href="#"><span class="fa fa-shield"></span><span class="card-pf-aggregate-status-count">9</span> Adipiscing</a>
          </h2>
          <div class="card-pf-body" style="height: 50px;">
            <p class="card-pf-aggregate-status-notifications">
              <span class="card-pf-aggregate-status-notification"><span class="pficon pficon-ok"></span></span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="card-pf card-pf-accented card-pf-aggregate-status" style="height: 89px;">
          <h2 class="card-pf-title" style="height: 17px;">
            <a href="#"><span class="fa fa-shield"></span><span class="card-pf-aggregate-status-count">12</span> Lorem</a>
          </h2>
          <div class="card-pf-body" style="height: 50px;">
            <p class="card-pf-aggregate-status-notifications">
              <a href="#"><span class="card-pf-aggregate-status-notification"><span class="pficon pficon-error-circle-o"></span>1</span></a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row row-cards-pf">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="card-pf card-pf-accented card-pf-aggregate-status card-pf-aggregate-status-mini" style="height: 59px;">
          <h2 class="card-pf-title" style="height: 42px;">
            <span class="fa fa-rebel"></span>
            <span class="card-pf-aggregate-status-count">0</span> Ipsum
          </h2>
          <div class="card-pf-body" style="height: 24px;">
            <p class="card-pf-aggregate-status-notifications">
              <span class="card-pf-aggregate-status-notification"><a href="#" class="add" data-toggle="tooltip" data-placement="top" title="Add Ipsum"><span class="pficon pficon-add-circle-o"></span></a></span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="card-pf card-pf-accented card-pf-aggregate-status card-pf-aggregate-status-mini" style="height: 59px;">
          <h2 class="card-pf-title" style="height: 42px;">
            <a href="#">
              <span class="fa fa-paper-plane"></span>
              <span class="card-pf-aggregate-status-count">20</span> Amet
            </a>
          </h2>
          <div class="card-pf-body" style="height: 24px;">
            <p class="card-pf-aggregate-status-notifications">
              <span class="card-pf-aggregate-status-notification"><a href="#"><span class="pficon pficon-error-circle-o"></span>4</a></span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="card-pf card-pf-accented card-pf-aggregate-status card-pf-aggregate-status-mini" style="height: 59px;">
          <h2 class="card-pf-title" style="height: 42px;">
            <a href="#">
              <span class="pficon pficon-cluster"></span>
              <span class="card-pf-aggregate-status-count">9</span> Adipiscing
            </a>
          </h2>
        <div class="card-pf-body" style="height: 24px;">
          <p class="card-pf-aggregate-status-notifications">
            <span class="card-pf-aggregate-status-notification"><span class="pficon pficon-ok"></span></span>
          </p>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-3">
      <div class="card-pf card-pf-accented card-pf-aggregate-status card-pf-aggregate-status-mini" style="height: 59px;">
        <h2 class="card-pf-title" style="height: 42px;">
          <a href="#">
            <span class="pficon pficon-image"></span>
            <span class="card-pf-aggregate-status-count">12</span> Lorem
          </a>
        </h2>
        <div class="card-pf-body" style="height: 24px;">
          <p class="card-pf-aggregate-status-notifications">
            <a href="#"><span class="card-pf-aggregate-status-notification"><span class="pficon pficon-error-circle-o"></span>1</span></a>
          </p>
        </div>
      </div>
    </div>
    </div>
    <div class="row row-cards-pf">
    <div class="col-xs-12 col-sm-6">
      <div class="card-pf" style="height: 360px;">
        <div class="card-pf-heading">
          <h2 class="card-pf-title" style="height: 17px;">
            Top Utilized
          </h2>
        </div>
        <div class="card-pf-body" style="height: 280px;">
          <div class="progress-description">
            Ipsum
          </div>
          <div class="progress progress-label-top-right">
            <div class="progress-bar progress-bar-danger" role="progressbar"style="width: 95%;" data-toggle="tooltip" title="95% Used">
              <span><strong>190.0 of 200.0 GB</strong> Used</span>
            </div>
            <div class="progress-bar progress-bar-remaining" role="progressbar" style="width: 5%;" data-toggle="tooltip" title="5% Available">
              <span class="sr-only">5% Available</span>
            </div>
          </div>
          <div class="progress-description">
            Amet
          </div>
          <div class="progress progress-label-top-right">
            <div class="progress-bar progress-bar-success" role="progressbar" style="width: 50%;" data-toggle="tooltip" title="50% Used">
              <span><strong>100.0 of 200.0 GB</strong> Used</span>
            </div>
            <div class="progress-bar progress-bar-remaining" role="progressbar" style="width: 50%;" data-toggle="tooltip" title="50% Available">
              <span class="sr-only">50% Available</span>
            </div>
          </div>
          <div class="progress-description">
            Adipiscing
          </div>
          <div class="progress progress-label-top-right">
            <div class="progress-bar progress-bar-warning" role="progressbar" style="width: 70%;" data-toggle="tooltip" title="70% Used">
              <span><strong>140.0 of 200.0 GB</strong> Used</span>
            </div>
            <div class="progress-bar progress-bar-remaining" role="progressbar" style="width: 30%;" data-toggle="tooltip" title="30% Available">
              <span class="sr-only">30% Available</span>
            </div>
          </div>
          <div class="progress-description">
            Lorem
          </div>
          <div class="progress progress-label-top-right">
            <div class="progress-bar progress-bar-warning" role="progressbar" style="width: 76.5%;" data-toggle="tooltip" title="76.5% Used">
              <span><strong>153.0 of 200.0 GB</strong> Used</span>
            </div>
            <div class="progress-bar progress-bar-remaining" role="progressbar" style="width: 23.5%;" data-toggle="tooltip" title="23.5% Available">
              <span class="sr-only">23.5% Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-6">
      <div class="card-pf" style="height: 360px;">
        <div class="card-pf-heading">
          <h2 class="card-pf-title" style="height: 17px;">
            Quotas
          </h2>
        </div>
        <div class="card-pf-body" style="height: 280px;">
          <div class="progress-container progress-description-left progress-label-right">
            <div class="progress-description">
              Ipsum
            </div>
            <div class="progress">
              <div class="progress-bar" role="progressbar" style="width: 25%;" data-toggle="tooltip" title="25% Used">
                <span><strong>115 of 460</strong> MHz</span>
              </div>
              <div class="progress-bar progress-bar-remaining" role="progressbar" style="width: 75%;" data-toggle="tooltip" title="75% Available">
                <span class="sr-only">75% Available</span>
              </div>
            </div>
          </div>
          <div class="progress-container progress-description-left progress-label-right">
            <div class="progress-description">
              Amet
            </div>
            <div class="progress">
              <div class="progress-bar" role="progressbar" style="width: 50%;" data-toggle="tooltip" title="8 GB Used">
                <span><strong>8 of 16</strong> GB</span>
              </div>
              <div class="progress-bar progress-bar-remaining" role="progressbar" style="width: 50%;" data-toggle="tooltip" title="8 GB Available">
                <span class="sr-only">50% Available</span>
              </div>
            </div>
          </div>
          <div class="progress-container progress-description-left progress-label-right">
          <div class="progress-description">
            Adipiscing
          </div>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: 62.5%;" data-toggle="tooltip" title="62.5% Used">
              <span><strong>5 of 8</strong> Total</span>
            </div>
            <div class="progress-bar progress-bar-remaining" role="progressbar" style="width: 37.5%;" data-toggle="tooltip" title="37.5% Available">
              <span class="sr-only">37.5% Available</span>
            </div>
          </div>
        </div>
        <div class="progress-container progress-description-left progress-label-right">
          <div class="progress-description">
          Lorem
          </div>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: 100%;" data-toggle="tooltip" title="100% Used">
              <span><strong>2 of 2</strong> Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
 </file>
</example>
*/
;/**
 * @ngdoc directive
 * @name patternfly.navigation.component:pfVerticalNavigation - Router
 * @restrict E
 *
 * @description
 *   This example shows how to use pfVerticalNavigation with angular-ui-router's $states and uiSrefs.
 *
 * @param {string} brandSrc src for brand image
 * @param {string} brandAlt  Text for product name when brand image is not available
 * @param {boolean} showBadges Flag if badges are used on navigation items, default: false
 * @param {boolean} persistentSecondary Flag to use persistent secondary menus, default: false
 * @param {boolean} hiddenIcons Flag to not show icons on the primary menu, default: false
 * @param {array} items List of navigation items
 * <ul style='list-style-type: none'>
 * <li>.title          - (string) Name of item to be displayed on the menu
 * <li>.iconClass      - (string) Classes for icon to be shown on the menu (ex. "fa fa-dashboard")
 * <li>.href           - (string) href link to navigate to on click
 * <li>.children       - (array) Submenu items (same structure as top level items)
 * <li>.badges         -  (array) Badges to display for the item, badges with a zero count are not displayed.
 *   <ul style='list-style-type: none'>
 *   <li>.count        - (number) Count to display in the badge
 *   <li>.iconClass    - (string) Class to use for showing an icon before the count
 *   <li>.tooltip      - (string) Tooltip to display for the badge
 *   <li>.badgeClass:  - (string) Additional class(es) to add to the badge container
 *   </ul>
 * <li>.uiSref         - (string) Optional Angular UI Router state name. If specified, href must be not defined, and vice versa.
 * <li>.uiSrefOptions  - (object) Optional object to be passed to Angular UI Router $state.go() function
 * </ul>
 * @param {function} navigateCallback function(item) Callback method invoked on a navigation item click (one with no submenus)
 * @param {function} itemClickCallback function(item) Callback method invoked on an item click
 * @param {boolean} updateActiveItemsOnClick Flag if active items should be marked on click rather than on navigation change, default: false
 * @param {boolean} ignoreMobile Flag if mobile state should be ignored (use only if absolutely necessary) default: false
 *
 * @example
 <example module="myApp" deps="patternfly.utils, patternfly.filters, patternfly.sort, patternfly.views">
  <file name="index.html">
    <div ng-controller="showDemoController">
      <button class="btn btn-primary" id="showVerticalNavWithRouter" ng-click="showVerticalNav()">Show Vertical Navigation with UIRouter</button>
      <label class="example-info-text">This will display the vertical nav bar and some mock content over the content of this page.</label>
      <label class="example-info-text">Exit the demo to return back to this page.</label>
    </div>
    <div id="verticalNavWithRouterLayout" class="layout-pf layout-pf-fixed faux-layout hidden" ng-controller="vertNavWithRouterController">
      <pf-vertical-navigation items="navigationItems" brand-alt="ANGULAR PATTERNFLY"
          show-badges="true" pinnable-menus="true" update-active-items-on-click="true"
          navigate-callback="handleNavigateClickRouter">
        <div>
          <ul class="nav navbar-nav">
          <li><button id="hideVerticalNavWithRouter" class="hide-vertical-nav" ng-click="hideVerticalNav()">Exit Vertical Navigation Demo</button></li>
          </ul>
          <ul class="nav navbar-nav navbar-right navbar-iconic">
            <li class="dropdown">
            </li>
            <li class="dropdown">
              <a class="dropdown-toggle nav-item-iconic" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span title="Help" class="fa pficon-help"></span>
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                <li><a href="#">Help</a></li>
                <li><a href="#">About</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <a class="dropdown-toggle nav-item-iconic" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span title="Username" class="fa pficon-user"></span>
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                <li><a href="#">Preferences</a></li>
                <li><a href="#">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </pf-vertical-navigation>
      <div id="contentContainer" class="container-fluid container-cards-pf container-pf-nav-pf-vertical example-page-container">
        <ui-view>
          <!-- Content will be added here -->
        </ui-view>
      </div>
    </div>
  </file>
  <file name="demo.js">
   angular.module('patternfly.navigation').controller('showDemoController', ['$scope',
   function ($scope) {
       $scope.showVerticalNav = function () {
         angular.element(document.querySelector("#verticalNavWithRouterLayout")).removeClass("hidden");
       };
     }
   ]);
  </file>
  <file name="script.js">
    angular.module('myApp',['patternfly.navigation', 'ui.router'])
      .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('dashboard');

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                template: '<div class="card-pf card-pf-accented card-pf-aggregate-status" style="height: 89px;">\
                              <div class="card-pf-body" style="height: 50px;">\
                                <p class="card-pf-aggregate-status-notifications">\
                                  State: Dashboard\
                                </p>\
                              </div>\
                            </div>'
            })
            .state('dolor', {
                url: '/dolor',
                template: '<div class="card-pf card-pf-accented card-pf-aggregate-status" style="height: 89px;">\
                              <div class="card-pf-body" style="height: 50px;">\
                                <p class="card-pf-aggregate-status-notifications">\
                                  State: Dolor\
                                </p>\
                              </div>\
                            </div>'
            })
            .state('ipsum', {
                url: '/ipsum',
                template: '<div class="card-pf card-pf-accented card-pf-aggregate-status" style="height: 89px;">\
                              <div class="card-pf-body" style="height: 50px;">\
                                <p class="card-pf-aggregate-status-notifications">\
                                  State: Ipsum\
                                </p>\
                              </div>\
                            </div>'
            });
    })
      .controller('vertNavWithRouterController', ['$scope',
        function ($scope) {
          $scope.navigationItems = [
            {
              title: "Dashboard",
              iconClass: "fa fa-dashboard",
              uiSref: "dashboard",
              uiSrefOptions: { someKey: 'SomeValue' }
            },
            {
              title: "Dolor",
              iconClass : "fa fa-shield",
              uiSref: "dolor"
            },
            {
              title: "Ipsum",
              iconClass : "fa fa-space-shuttle",
              uiSref: "ipsum"
            },
            {
              title: "Exit Demo"
            }
          ];
          $scope.hideVerticalNav = function() {
            angular.element(document.querySelector("#verticalNavWithRouterLayout")).addClass("hidden");
          };
          $scope.handleNavigateClickRouter = function (item) {
            if (item.title === "Exit Demo") {
              $scope.hideVerticalNav();
            }
          };
        }
      ]);
  </file>
</example>
*/
;angular.module('patternfly.navigation').component('pfVerticalNavigation', {
  bindings: {
    brandSrc: '@',
    brandAlt: '@',
    showBadges: '@',
    persistentSecondary: '@',
    pinnableMenus: '@',
    hiddenIcons: '@',
    items: '=',
    navigateCallback: '=?',
    itemClickCallback: '=?',
    updateActiveItemsOnClick: '@',
    ignoreMobile: '@'
  },
  //replace: true,
  templateUrl: 'navigation/vertical-navigation.html',
  transclude: true,
  controller: ["$window", "$timeout", "$injector", "$location", "$rootScope", function ($window, $timeout, $injector, $location, $rootScope) {
    'use strict';
    var routeChangeListener,
      ctrl = this,
      $state;

    // Private internal functions
    var breakpoints = {
      'tablet': 768,
      'desktop': 1200
    };
    var explicitCollapse = false;
    var hoverDelay = 500;
    var hideDelay = hoverDelay + 200;

    var getBodyContentElement = function () {
      return angular.element(document.querySelector('.container-pf-nav-pf-vertical'));
    };

    var initBodyElement = function () {
      var bodyContentElement = getBodyContentElement();
      if (ctrl.showBadges) {
        bodyContentElement.addClass('nav-pf-vertical-with-badges');
      }
      if (ctrl.persistentSecondary) {
        bodyContentElement.addClass('nav-pf-persistent-secondary');
      }
      if (ctrl.hiddenIcons) {
        bodyContentElement.addClass('hidden-icons-pf');
      }
    };

    var updateMobileMenu = function (selected, secondaryItem) {
      ctrl.items.forEach(function (item) {
        item.isMobileItem = false;
        if (item.children) {
          item.children.forEach(function (nextSecondary) {
            nextSecondary.isMobileItem = false;
          });
        }
      });

      if (selected) {
        selected.isMobileItem = true;
        if (secondaryItem) {
          secondaryItem.isMobileItem = true;
          ctrl.showMobileSecondary = false;
          ctrl.showMobileTertiary = true;
        } else {
          ctrl.showMobileSecondary = true;
          ctrl.showMobileTertiary = false;
        }
      } else {
        ctrl.showMobileSecondary = false;
        ctrl.showMobileTertiary = false;
      }
    };


    var checkNavState = function () {
      var width = $window.innerWidth;
      var bodyContentElement = getBodyContentElement();

      // Check to see if we need to enter/exit the mobile state
      if (!ctrl.ignoreMobile && width < patternfly.pfBreakpoints.tablet) {
        if (!ctrl.inMobileState) {
          ctrl.inMobileState = true;

          //Set the body class to the correct state
          bodyContentElement.removeClass('collapsed-nav');
          bodyContentElement.addClass('hidden-nav');

          // Reset the collapsed states
          updateSecondaryCollapsedState(false);
          updateTertiaryCollapsedState(false);

          explicitCollapse = false;
        }
      } else  {
        ctrl.inMobileState = false;
        ctrl.showMobileNav = false;

        // Set the body class back to the default
        bodyContentElement.removeClass('hidden-nav');
      }

      if (explicitCollapse) {
        ctrl.navCollapsed = true;
        bodyContentElement.addClass('collapsed-nav');
      } else {
        ctrl.navCollapsed = false;
        bodyContentElement.removeClass('collapsed-nav');
      }
    };

    var collapseMenu = function () {
      var bodyContentElement = getBodyContentElement();
      ctrl.navCollapsed = true;

      //Set the body class to the correct state
      bodyContentElement.addClass('collapsed-nav');

      explicitCollapse = true;
    };

    var expandMenu = function () {
      var bodyContentElement = getBodyContentElement();
      ctrl.navCollapsed = false;

      //Set the body class to the correct state
      bodyContentElement.removeClass('collapsed-nav');

      explicitCollapse = false;

      // Dispatch a resize event when showing the expanding then menu to
      // allow content to adjust to the menu sizing
      angular.element($window).triggerHandler('resize');
    };

    var forceHideSecondaryMenu = function () {
      ctrl.forceHidden = true;
      $timeout(function () {
        ctrl.forceHidden = false;
      }, 500);
    };

    var setParentActive = function (item) {
      ctrl.items.forEach(function (topLevel) {
        if (topLevel.children) {
          topLevel.children.forEach(function (secondLevel) {
            if (secondLevel === item) {
              topLevel.isActive = true;
            }
            if (secondLevel.children) {
              secondLevel.children.forEach(function (thirdLevel) {
                if (thirdLevel === item) {
                  topLevel.isActive = true;
                  secondLevel.isActive = true;
                }
              });
            }
          });
        }
      });
    };

    var getFirstNavigateChild = function (item) {
      var firstChild;
      if (!item.children || item.children.length < 1) {
        firstChild = item;
      } else {
        firstChild = getFirstNavigateChild(item.children[0]);
      }
      return firstChild;
    };

    var setSecondaryItemVisible = function () {
      var bodyContentElement = getBodyContentElement();
      ctrl.activeSecondary = false;

      if (ctrl.persistentSecondary && !ctrl.inMobileState) {
        ctrl.items.forEach(function (topLevel) {
          if (topLevel.children) {
            topLevel.children.forEach(function (secondLevel) {
              if (secondLevel.isActive) {
                ctrl.activeSecondary = true;
              }
            });
          }
        });
        if (ctrl.activeSecondary) {
          bodyContentElement.addClass('secondary-visible-pf');
        } else {
          bodyContentElement.removeClass('secondary-visible-pf');
        }
      }
    };

    var navigateToItem = function (item) {
      var navItem = getFirstNavigateChild(item);
      var navTo;
      if (navItem) {
        ctrl.showMobileNav = false;
        if (navItem.uiSref && navItem.href) {
          throw new Error('Using both uiSref and href on an item is not supported.');
        }
        if (navItem.uiSref) {
          if ($state === undefined) {
            throw new Error('uiSref is defined on item, but no $state has been injected. ' +
              'Did you declare a dependency on "ui.router" module in your app?');
          }
          $state.go(navItem.uiSref, navItem.uiSrefOptions);
        } else {
          navTo = navItem.href;
          if (navTo) {
            if (navTo.startsWith('#/')) {
              navTo = navTo.substring(2);
            }
            $location.path(navTo);
          }
        }
        if (ctrl.navigateCallback) {
          ctrl.navigateCallback(navItem);
        }
      }

      if (ctrl.itemClickCallback) {
        ctrl.itemClickCallback(item);
      }

      if (ctrl.updateActiveItemsOnClick ) {
        ctrl.clearActiveItems();
        navItem.isActive = true;
        setParentActive(navItem);
        setSecondaryItemVisible();
      }
      setSecondaryItemVisible();
    };

    var primaryHover = function () {
      var hover = false;
      ctrl.items.forEach(function (item) {
        if (item.isHover) {
          hover = true;
        }
      });
      return hover;
    };

    var secondaryHover = function () {
      var hover = false;
      ctrl.items.forEach(function (item) {
        if (item.children && item.children.length > 0) {
          item.children.forEach(function (secondaryItem) {
            if (secondaryItem.isHover) {
              hover = true;
            }
          });
        }
      });
      return hover;
    };

    var updateSecondaryCollapsedState = function (setCollapsed, collapsedItem) {
      var bodyContentElement = getBodyContentElement();
      if (collapsedItem) {
        collapsedItem.secondaryCollapsed = setCollapsed;
      }
      if (setCollapsed) {
        ctrl.collapsedSecondaryNav = true;

        bodyContentElement.addClass('collapsed-secondary-nav-pf');
      } else {
        // Remove any collapsed secondary menus
        if (ctrl.items) {
          ctrl.items.forEach(function (item) {
            item.secondaryCollasped = false;
          });
        }
        ctrl.collapsedSecondaryNav = false;

        bodyContentElement.removeClass('collapsed-secondary-nav-pf');
      }
    };

    var updateTertiaryCollapsedState = function (setCollapsed, collapsedItem) {
      var bodyContentElement = getBodyContentElement();
      if (collapsedItem) {
        collapsedItem.tertiaryCollapsed = setCollapsed;
      }
      if (setCollapsed) {
        ctrl.collapsedTertiaryNav = true;

        bodyContentElement.addClass('collapsed-tertiary-nav-pf');
        updateSecondaryCollapsedState(false);
      } else {
        // Remove any collapsed secondary menus
        if (ctrl.items) {
          ctrl.items.forEach(function (item) {
            if (item.children && item.children.length > 0) {
              item.children.forEach(function (secondaryItem) {
                secondaryItem.tertiaryCollasped = false;
              });
            }
          });
        }
        ctrl.collapsedTertiaryNav = false;

        bodyContentElement.removeClass('collapsed-tertiary-nav-pf');
      }
    };

    ctrl.showBadges = ctrl.showBadges === 'true';
    ctrl.persistentSecondary = ctrl.persistentSecondary === 'true';
    ctrl.pinnableMenus = ctrl.pinnableMenus === 'true';
    ctrl.hiddenIcons = ctrl.hiddenIcons === 'true';
    ctrl.updateActiveItemsOnClick = ctrl.updateActiveItemsOnClick === 'true';
    ctrl.ignoreMobile = ctrl.ignoreMobile === 'true';
    ctrl.activeSecondary = false;
    ctrl.showMobileNav = false;
    ctrl.showMobileSecondary = false;
    ctrl.showMobileTertiary = false;
    ctrl.hoverSecondaryNav = false;
    ctrl.hoverTertiaryNav = false;
    ctrl.collapsedSecondaryNav = false;
    ctrl.collapsedTertiaryNav = false;
    ctrl.navCollapsed = false;
    ctrl.forceHidden = false;

    ctrl.clearActiveItems = function () {
      ctrl.items.forEach(function (item) {
        item.isActive = false;
        if (item.children) {
          item.children.forEach(function (secondary) {
            secondary.isActive = false;
            if (secondary.children) {
              secondary.children.forEach(function (tertiary) {
                tertiary.isActive = false;
              });
            }
          });
        }
      });
    };

    ctrl.setActiveItems = function () {
      var updatedRoute = "#" + $location.path();
      //Setting active state on load
      ctrl.items.forEach(function (topLevel) {
        if (updatedRoute.indexOf(topLevel.href) > -1) {
          topLevel.isActive = true;
        }
        if (topLevel.children) {
          topLevel.children.forEach(function (secondLevel) {
            if (updatedRoute.indexOf(secondLevel.href) > -1) {
              secondLevel.isActive = true;
              topLevel.isActive = true;
            }
            if (secondLevel.children) {
              secondLevel.children.forEach(function (thirdLevel) {
                if (updatedRoute.indexOf(thirdLevel.href) > -1) {
                  thirdLevel.isActive = true;
                  secondLevel.isActive = true;
                  topLevel.isActive = true;
                }
              });
            }
          });
        }
      });
    };

    ctrl.handleNavBarToggleClick = function () {

      if (ctrl.inMobileState) {
        // Toggle the mobile nav
        if (ctrl.showMobileNav) {
          ctrl.showMobileNav = false;
        } else {
          // Always start at the primary menu
          updateMobileMenu();
          ctrl.showMobileNav = true;
        }
      } else if (ctrl.navCollapsed) {
        expandMenu();
      } else {
        collapseMenu();
      }
    };

    ctrl.handlePrimaryClick = function (item, event) {
      if (ctrl.inMobileState) {
        if (item.children && item.children.length > 0) {
          updateMobileMenu(item);
        } else {
          updateMobileMenu();
          navigateToItem(item);
        }
      } else {
        navigateToItem(item);
      }
    };

    ctrl.handleSecondaryClick = function (primary, secondary, event) {
      if (ctrl.inMobileState) {
        if (secondary.children && secondary.children.length > 0) {
          updateMobileMenu(primary, secondary);
        } else {
          updateMobileMenu();
          navigateToItem(secondary);
        }
      } else {
        navigateToItem(secondary);
      }
    };

    ctrl.handleTertiaryClick = function (primary, secondary, tertiary, event) {
      if (ctrl.inMobileState) {
        updateMobileMenu();
      }

      navigateToItem(tertiary);
    };

    // Show secondary nav bar on hover of primary nav items
    ctrl.handlePrimaryHover = function (item) {
      if (item.children && item.children.length > 0) {
        if (!ctrl.inMobileState) {
          if (item.navUnHoverTimeout !== undefined) {
            $timeout.cancel(item.navUnHoverTimeout);
            item.navUnHoverTimeout = undefined;
          } else if (ctrl.navHoverTimeout === undefined && !item.isHover) {
            item.navHoverTimeout = $timeout(function () {
              ctrl.hoverSecondaryNav = true;
              item.isHover = true;
              item.navHoverTimeout = undefined;
            }, hoverDelay);
          }
        }
      }
    };

    ctrl.handlePrimaryUnHover = function (item) {
      if (item.children && item.children.length > 0) {
        if (item.navHoverTimeout !== undefined) {
          $timeout.cancel(item.navHoverTimeout);
          item.navHoverTimeout = undefined;
        } else if (item.navUnHoverTimeout === undefined && item.isHover) {
          item.navUnHoverTimeout = $timeout(function () {
            item.isHover = false;
            if (!primaryHover()) {
              ctrl.hoverSecondaryNav = false;
            }
            item.navUnHoverTimeout = undefined;
          }, hideDelay);
        }
      }
    };

    // Show tertiary nav bar on hover of secondary nav items
    ctrl.handleSecondaryHover = function (item) {
      if (item.children && item.children.length > 0) {
        if (!ctrl.inMobileState) {
          if (item.navUnHoverTimeout !== undefined) {
            $timeout.cancel(item.navUnHoverTimeout);
            item.navUnHoverTimeout = undefined;
          } else if (ctrl.navHoverTimeout === undefined) {
            item.navHoverTimeout = $timeout(function () {
              ctrl.hoverTertiaryNav = true;
              item.isHover = true;
              item.navHoverTimeout = undefined;
            }, hoverDelay);
          }
        }
      }
    };

    ctrl.handleSecondaryUnHover = function (item) {
      if (item.children && item.children.length > 0) {
        if (item.navHoverTimeout !== undefined) {
          $timeout.cancel(item.navHoverTimeout);
          item.navHoverTimeout = undefined;
        } else if (item.navUnHoverTimeout === undefined) {
          item.navUnHoverTimeout = $timeout(function () {
            item.isHover = false;
            if (!secondaryHover()) {
              ctrl.hoverTertiaryNav = false;
            }
            item.navUnHoverTimeout = undefined;
          }, hideDelay);
        }
      }
    };

    ctrl.collapseSecondaryNav = function (item, event) {
      if (ctrl.inMobileState) {
        updateMobileMenu();
      } else {
        if (item.secondaryCollapsed) {
          updateSecondaryCollapsedState(false, item);
          forceHideSecondaryMenu();
        } else {
          updateSecondaryCollapsedState(true, item);
        }
      }

      ctrl.hoverSecondaryNav = false;
      event.stopImmediatePropagation();
    };

    ctrl.collapseTertiaryNav = function (item, event) {
      if (ctrl.inMobileState) {
        ctrl.items.forEach(function (primaryItem) {
          if (primaryItem.children) {
            primaryItem.children.forEach(function (secondaryItem) {
              if (secondaryItem === item) {
                updateMobileMenu(primaryItem);
              }
            });
          }
        });
      } else {
        if (item.tertiaryCollapsed) {
          updateTertiaryCollapsedState(false, item);
          forceHideSecondaryMenu();
        } else {
          updateTertiaryCollapsedState(true, item);
        }
      }

      ctrl.hoverSecondaryNav = false;
      ctrl.hoverTertiaryNav = false;
      event.stopImmediatePropagation();
    };


    ctrl.$onInit = function () {
      // Optional dependency on $state
      if ($injector.has("$state")) {
        $state = $injector.get("$state");
      }

      if (!ctrl.updateActiveItemsOnClick) {
        if ($rootScope) {
          routeChangeListener = $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
            ctrl.clearActiveItems();
            ctrl.setActiveItems();
          });
        }
      }

      initBodyElement();
      checkNavState();

      // Need to bind to resize event
      angular.element($window).on('resize', function () {
        checkNavState();
      });
    };

    ctrl.$onDestroy = function () {
      if (_.isFunction(routeChangeListener)) {
        routeChangeListener();
      }
    };
  }],
});
;/**
 * @ngdoc directive
 * @name patternfly.notification.component:pfInlineNotification
 * @restrict E
 * @scope
 *
 * @param {expression=} pfNotificationType The type of the notification message. Allowed value is one of these: 'success','info','danger', 'warning'.
 * @param {expression=} pfNotificationMessage The main text message of the notification.
 * @param {expression=} pfNotificationHeader The header text of the notification.
 * @param {expression=} pfNotificationPersistent The notification won't disappear after delay timeout, but has to be closed manually with the close button.
 * @param {expression=} pfNotificationRemove The function to remove the notification (called by the close button when clicked).
 *
 * @description
 * The main visual element of the notification message.
 *
 * @example
 <example module="patternfly.notification">

   <file name="index.html">
     <div ng-controller="NotificationDemoCtrl">

       <pf-inline-notification pf-notification-type="notification.type"
                        pf-notification-header="notification.header"
                        pf-notification-message="notification.message"
                        pf-notification-persistent="notification.isPersistent"
                        pf-notification-remove="removeNotification()">
       </pf-inline-notification>

       <form class="form-horizontal">
         <div class="form-group">
           <label class="col-sm-2 control-label" for="header">Header:</label>
           <div class="col-sm-10">
            <input type="text" class="form-control" ng-model="notification.header" id="header"/>
           </div>
         </div>
         <div class="form-group">
           <label class="col-sm-2 control-label" for="message">Message:</label>
           <div class="col-sm-10">
            <input type="text" class="form-control" ng-model="notification.message" id="message"/>
           </div>
         </div>
         <div class="form-group">
           <label class="col-sm-2 control-label" for="type">Type:</label>
           <div class="col-sm-10">
             <div class="btn-group" uib-dropdown>
               <button type="button" uib-dropdown-toggle class="btn btn-default">
                 {{notification.type}}
                 <span class="caret"></span>
               </button>
               <ul uib-dropdown-menu class="dropdown-menu-right" role="menu">
                 <li ng-repeat="item in types" ng-class="{'selected': item === notification.type}">
                 <a role="menuitem" tabindex="-1" ng-click="updateType(item)">
                   {{item}}
                 </a>
                 </li>
               </ul>
             </div>
           </div>
         </div>
         <div class="form-group">
           <label class="col-sm-2 control-label" for="type">Persistent:</label>
           <div class="col-sm-10">
            <input type="checkbox" ng-model="notification.isPersistent"></input>
           </div>
         </div>
       </form>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.notification' ).controller( 'NotificationDemoCtrl', function( $scope, $timeout ) {
       $scope.types = ['success','info','danger', 'warning'];

       $scope.updateType = function(item) {
         $scope.notification.type = item;
       };

       $scope.removeNotification = function () {
         $scope.notification = undefined;
         // Add notification back for demo purposes
         $timeout(function() {
           createNotification();
         }, 1000);
       };

       var createNotification = function () {
         $scope.notification = {
           type: $scope.types[0],
           isPersistent: false,
           header: 'Default Header.',
           message: 'Default Message.'
         };
       };
       createNotification();
     });
   </file>

 </example>
 */
angular.module( 'patternfly.notification' ).component('pfInlineNotification', {
  bindings: {
    'pfNotificationType': '=',
    'pfNotificationMessage': '=',
    'pfNotificationHeader': '=',
    'pfNotificationPersistent': '=',
    'pfNotificationIndex': '=',
    'pfNotificationRemove': '&?'
  },
  templateUrl: 'notification/inline-notification.html'
});
;/**
 * @ngdoc directive
 * @name patternfly.notification.component:pfNotificationDrawer
 * @restrict E
 *
 * @description
 *   Component for rendering a notification drawer. This provides a common mechanism to handle how the notification
 *   drawer should look and behave without mandating the look of the notification group heading or notification body.
 *   <br><br>
 *   An array of notification groups must be passed to create each group in the drawer. Each notification
 *   group must include an array of notifications to be shown for that group, the array MUST be called 'notifications'.
 *   You must provide the source for the heading, sub-heading, and notification body to show the content you desire for each.
 *   Pass a customScope object containing any scope variables/functions you need to access from the included source, access these
 *   via hanlders.<your handler> in your included source.
 *   <br><br>
 *
 * @param {boolean} drawerHidden Flag if the drawer is currently hidden
 * @param {boolean} allowExpand Flag if the drawer can be expanded. Optional, default: false
 * @param {boolean} drawExpanded Flag if the drawer is expanded (only valid if allowExpand is true). Optional, default: false
 * @param {string}  drawerTitle  Title to display for the drawer (leaving this blank will remove the provided expand capability)
 * @param {object} notificationGroups Array of notification groups to add to the drawer
 * @param {string} actionButtonTitle Text for the lower action button of the drawer (optional, if not specified there will be no action button)
 * @param {function} actionButtonCallback function(notificationGroup) Callback method for action button for each group, the notificationGroup is passed (Optional)
 * @param {string} titleInclude Include src for the title area for the notification drawer, use this to customize the drawer title area
 * @param {string} headingInclude Include src for the heading area for each notification group, access the group via notificationGroup
 * @param {string} subheadingInclude Include src for the sub-heading area for each notification group, access the group via notificationGroup
 * @param {string} notificationBodyInclude Include src for the notification body for each notification, access the notification via notification
 * @param {string} notificationFooterInclude Include src for the notification footer for each notification, access the notification via notification
 * @param {object} customScope Object containing any variables/functions used by the included src, access via $ctrl.customScope.<xxx>
 *
 * @example
 <example module="patternfly.notification" deps="patternfly.utils, patternfly.filters, patternfly.sort, patternfly.views">
 <file name="index.html">
   <div ng-controller="DrawerCtrl" class="row example-container">
     <div class="col-md-12 pre-demo-text">
       <label>Click the notifications indicator to show the Notification Drawer: </label>
     </div>
     <div class="navbar-pf-vertical">
       <nav class="collapse navbar-collapse">
         <ul class="nav navbar-nav navbar-left navbar-iconic">
           <li class="drawer-pf-trigger dropdown">
             <a class="nav-item-iconic drawer-pf-trigger-icon" ng-click="toggleShowDrawer()">
               <span class="fa fa-bell" title="Notifications"></span>
             </a>
           </li>
         </ul>
       </nav>
     </div>
     <div class="layout-pf-fixed">
       <div class="navbar-pf-vertical">
         <pf-notification-drawer drawer-hidden="hideDrawer" drawer-title="Notifications Drawer" allow-expand="true"
              action-button-title="Mark All Read" action-button-callback="actionButtonCB" notification-groups="groups"
              heading-include="heading.html" subheading-include="subheading.html" notification-body-include="notification-body.html"
              notification-footer-include="notification-footer.html" custom-scope="customScope">
         </pf-notification-drawer>
       </div>
     </div>
     <div class="col-md-12">
       <label class="actions-label">Actions: </label>
     </div>
     <div class="col-md-12">
       <textarea rows="3" class="col-md-12">{{actionsText}}</textarea>
     </div>
   </div>
 </file>
 <file name="heading.html">
   {{notificationGroup.heading}}
 </file>
 <file name="subheading.html">
   {{notificationGroup.subHeading}}
 </file>
 <file name="notification-footer.html">
   <a class="btn btn-link btn-block" role="button" ng-click="$ctrl.customScope.clearAll(notificationGroup)">
     <span class="pficon pficon-close"></span>
     <span> Clear All</span>
   </a>
 </file>
 <file name="notification-body.html">
   <div ng-if="!drawerExpanded">
     <div uib-dropdown class="dropdown pull-right dropdown-kebab-pf" ng-if="notification.actions && notification.actions.length > 0">
       <button uib-dropdown-toggle class="btn btn-link dropdown-toggle" type="button" id="dropdownKebabRight" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         <span class="fa fa-ellipsis-v"></span>
       </button>
       <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight">
         <li ng-repeat="action in notification.actions"
             role="{{action.isSeparator === true ? 'separator' : 'menuitem'}}"
             ng-class="{'divider': action.isSeparator === true, 'disabled': action.isDisabled === true}">
           <a ng-if="action.isSeparator !== true" class="secondary-action" title="{{action.title}}" ng-click="$ctrl.customScope.handleAction(notification, action)">
             {{action.name}}
           </a>
         </li>
       </ul>
     </div>
     <span ng-if="notification.status" class="{{'pull-left ' + $ctrl.customScope.getNotficationStatusIconClass(notification)}}" ng-click="$ctrl.customScope.markRead(notification)"></span>
     <span class="drawer-pf-notification-message" ng-click="$ctrl.customScope.markRead(notification)">{{notification.message}}</span>
     <div class="drawer-pf-notification-info" ng-click="$ctrl.customScope.markRead(notification)">
       <span class="date">{{notification.timeStamp | date:'MM/dd/yyyy'}}</span>
       <span class="time">{{notification.timeStamp | date:'h:mm:ss a'}}</span>
     </div>
   </div>
   <div ng-if="drawerExpanded" class="container-fluid">
     <div class="row">
       <div class="col-sm-6">
         <span class="pull-left {{$ctrl.customScope.getNotficationStatusIconClass(notification)}}"></span>
         <span class="drawer-pf-notification-message notification-message"
               tooltip-append-to-body="true" tooltip-popup-delay="500" tooltip-placement="bottom" tooltip="{{notification.message}}">
               {{notification.message}}
         </span>
       </div>
       <div class="col-sm-6">
         <div class="drawer-pf-notification-info">
           <span class="date">{{notification.timeStamp | date:'MM/dd/yyyy'}}</span>
           <span class="time">{{notification.timeStamp | date:'h:mm:ss a'}}</span>
         </div>
         <div class="dropdown pull-right dropdown-kebab-pf" ng-if="notification.actions && notification.actions.length > 0">
           <button class="btn btn-link dropdown-toggle" type="button" id="dropdownKebabRight" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
             <span class="fa fa-ellipsis-v"></span>
           </button>
           <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight">
             <li ng-repeat="action in notification.actions"
                 role="{{action.isSeparator === true ? 'separator' : 'menuitem'}}"
                 ng-class="{'divider': action.isSeparator === true, 'disabled': action.isDisabled === true}">
               <a ng-if="action.isSeparator !== true" class="secondary-action" title="{{action.title}}" ng-click="$ctrl.customScope.handleAction(notification, action)">
                 {{action.name}}
               </a>
             </li>
           </ul>
         </div>
       </div>
     </div>
   </div>
 </file>
 <file name="script.js">
   angular.module('patternfly.notification').controller('DrawerCtrl', ['$scope',
     function ($scope) {
       var currentTime = (new Date()).getTime();
       $scope.hideDrawer = true;
       $scope.toggleShowDrawer = function () {
         $scope.hideDrawer = !$scope.hideDrawer;
       };

       var menuActions = [
          {
            name: 'Action',
            title: 'Perform an action'
          },
          {
            name: 'Another Action',
            title: 'Do something else'
          },
          {
            name: 'Disabled Action',
            title: 'Unavailable action',
            isDisabled: true
          },
          {
            name: 'Something Else',
            title: ''
          },
          {
            isSeparator: true
          },
          {
            name: 'Grouped Action 1',
            title: 'Do something'
          },
          {
            name: 'Grouped Action 2',
            title: 'Do something similar'
          }
        ];


       $scope.groups = [
         {
           heading: "Notification Tab 1",
           subHeading: "5 New Events",
           notifications: [
             {
               unread: true,
               message: "A New Event! Huzzah! Bold",
               status: 'info',
               actions: menuActions,
               timeStamp: currentTime - (1 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'ok',
               actions: menuActions,
               timeStamp: currentTime - (2 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'warning',
               actions: menuActions,
               timeStamp: currentTime - (10 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'error',
               actions: menuActions,
               timeStamp: currentTime - (12 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "A New Event! Huzzah! Bold",
               status: 'info',
               actions: menuActions,
               timeStamp: currentTime - (1 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'error',
               actions: menuActions,
               timeStamp: currentTime - (2 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'ok',
               actions: menuActions,
               timeStamp: currentTime - (10 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'warning',
               actions: menuActions,
               timeStamp: currentTime - (12 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'info',
               actions: menuActions,
               timeStamp: currentTime - (240 * 60 * 60 * 1000)
             }
           ],
           isLoading: true
         },
         {
           heading: "Notification Tab 2",
           subHeading: "3 New Events",
           notifications: [
             {
               unread: true,
               message: "A New Event! Huzzah! Bold",
               status: 'info',
               actions: menuActions,
               timeStamp: currentTime - (1 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'error',
               actions: menuActions,
               timeStamp: currentTime - (2 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'warning',
               actions: menuActions,
               timeStamp: currentTime - (10 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'ok',
               actions: menuActions,
               timeStamp: currentTime - (12 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'warning',
               actions: menuActions,
               timeStamp: currentTime - (240 * 60 * 60 * 1000)
             }
           ]
         },
         {
           heading: "Notification Tab 3",
           subHeading: "3 New Events",
           notifications: [
             {
               unread: true,
               message: "A New Event! Huzzah! Bold",
               status: 'ok',
               actions: menuActions,
               timeStamp: currentTime - (1 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'warning',
               actions: menuActions,
               timeStamp: currentTime - (2 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'info',
               actions: menuActions,
               timeStamp: currentTime - (10 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'ok',
               actions: menuActions,
               timeStamp: currentTime - (12 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'error',
               actions: menuActions,
               timeStamp: currentTime - (240 * 60 * 60 * 1000)
             }
           ]
         },
         {
           heading: "Notification Tab 4",
           subHeading: "3 New Events",
           notifications: [
             {
               unread: true,
               message: "A New Event! Huzzah! Bold",
               status: 'warning',
               actions: menuActions,
               timeStamp: currentTime - (1 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'ok',
               actions: menuActions,
               timeStamp: currentTime - (2 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'ok',
               actions: menuActions,
               timeStamp: currentTime - (10 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'error',
               actions: menuActions,
               timeStamp: currentTime - (12 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'info',
               actions: menuActions,
               timeStamp: currentTime - (240 * 60 * 60 * 1000)
             }
           ]
         },
         {
           heading: "Notification Tab 5",
           subHeading: "3 New Events",
           notifications: [
             {
               unread: true,
               message: "A New Event! Huzzah! Bold",
               status: 'error',
               actions: menuActions,
               timeStamp: currentTime - (1 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'error',
               actions: menuActions,
               timeStamp: currentTime - (2 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'warning',
               actions: menuActions,
               timeStamp: currentTime - (10 * 60 * 60 * 1000)
             },
             {
               unread: false,
               message: "Another Event Notification",
               status: 'warning',
               actions: menuActions,
               timeStamp: currentTime - (12 * 60 * 60 * 1000)
             },
             {
               unread: true,
               message: "Another Event Notification",
               status: 'error',
               actions: menuActions,
               timeStamp: currentTime - (240 * 60 * 60 * 1000)
             }
           ]
         }
       ];

       $scope.actionsText = "";
       $scope.actionButtonCB = function (group) {
         $scope.actionsText = "Action Button clicked: " + group.heading + "\n" + $scope.actionsText;
         group.notifications.forEach(function(nextNotification) {
           nextNotification.unread = false;
         });
         group.subHeading =  "0 New Events";
       };

       //
       // Define customScope to contain anything that needs to be accessed from the included source
       // html files (heading, subheading, or notificaton body).
       //

       $scope.customScope = {};
       $scope.customScope.getNotficationStatusIconClass = function (notification) {
         var retClass = '';
         if (notification && notification.status) {
           if (notification.status === 'info') {
             retClass = "pficon pficon-info";
           } else if (notification.status === 'error') {
             retClass = "pficon pficon-error-circle-o";
           } else if (notification.status === 'warning') {
             retClass = "pficon pficon-warning-triangle-o";
           } else if (notification.status === 'ok') {
             retClass = "pficon pficon-ok";
           }
         }
         return retClass;
       };
       $scope.customScope.handleAction = function (notification, action) {
         if (action.isDisabled) {
           return;
         }
         var newText = notification.message + " - " + action.name;
         $scope.actionsText = newText + "\n" + $scope.actionsText;
       };
       $scope.customScope.clearAll = function (group) {
         var newText = group.heading + " - Clear All";
         $scope.actionsText = newText + "\n" + $scope.actionsText;
         group.notifications = [];
         group.subHeading = "0 New Events";
       };

       $scope.customScope.markRead = function (notification) {
         if (notification.unread) {
           notification.unread = false;
           $scope.actionsText = "Mark notification read" + "\n" + $scope.actionsText;
           var notificationGroup = $scope.groups.find(function(group) {
             return group.notifications.find(function(nextNotification) {
               return notification == nextNotification;
             });
           });
           var unread = notificationGroup.notifications.filter(function(nextNotification) {
             return nextNotification.unread;
           });
           notificationGroup.subHeading =  unread.length + " New Events";
         }
       };
     }
   ]);
 </file>
</example>
*/
angular.module('patternfly.notification').component('pfNotificationDrawer', {
  bindings: {
    drawerHidden: '<?',
    allowExpand: '=?',
    drawerExpanded: '=?',
    drawerTitle: '@',
    notificationGroups: '<',
    actionButtonTitle: '@',
    actionButtonCallback: '=?',
    titleInclude: '@',
    headingInclude: '@',
    subheadingInclude: '@',
    notificationBodyInclude: '@',
    notificationFooterInclude: '@',
    customScope: '=?'
  },
  templateUrl: 'notification/notification-drawer.html',
  controller: ["$window", "$timeout", "$element", function ($window, $timeout, $element) {
    'use strict';
    var ctrl = this;

    ctrl.toggleCollapse = function (selectedGroup) {
      if (selectedGroup.open) {
        selectedGroup.open = false;
      } else {
        ctrl.notificationGroups.forEach(function (group) {
          group.open = false;
        });
        selectedGroup.open = true;
      }
    };

    ctrl.toggleExpandDrawer = function () {
      ctrl.drawerExpanded = !ctrl.drawerExpanded;
    };

    ctrl.$onInit = function () {
      if (!ctrl.allowExpand || angular.isUndefined(ctrl.drawerExpanded)) {
        ctrl.drawerExpanded = false;
      }
    };

    ctrl.$onChanges = function (changesObj) {
      var openFound = false;
      if (changesObj.notificationGroups) {
        changesObj.notificationGroups.currentValue.forEach(function (group) {
          if (group.open) {
            if (openFound) {
              group.open = false;
            } else {
              openFound = true;
            }
          }
        });
      }

      if (changesObj.drawerHidden) {
        $timeout(function () {
          angular.element($window).triggerHandler('resize');
        }, 100);
      }
    };

    ctrl.$postLink = function () {
      if (ctrl.groupHeight) {
        $element.find('.panel-group').css("height", ctrl.groupHeight);
      }
      if (ctrl.groupClass) {
        $element.find('.panel-group').addClass(ctrl.groupClass);
      }
    };
  }]
});
;/**
 * @ngdoc service
 * @name patternfly.notification.Notification
 * @requires $rootScope
 *
 * @description
 * Notification service used to notify user about important events in the application.
 *
 * ## Configuring the service
 *
 * You can configure the service with: setDelay, setVerbose and setPersist.
 *
 * ### Notifications.setDelay
 * Set the delay after which the notification is dismissed. The argument of this method expects miliseconds. Default
 * delay is 5000 ms.
 *
 * ### Notifications.setVerbose
 * Set the verbose mode to on (default) or off. During the verbose mode, each notification is printed in the console,
 * too. This is done using the default angular.js $log service.
 *
 * ### Notifications.setPersist
 * Sets persist option for particular modes. Notification with persistent mode won't be dismissed after delay, but has
 * to be closed manually with the close button. By default, the "error" and "httpError" modes are set to persistent.
 * The input is an object in format {mode: persistValue}.
 *
 * ## Configuration Example
 * ```js
 * angular.module('myApp', []).config(function (NotificationsProvider) {
 *   NotificationsProvider.setDelay(10000).setVerbose(false).setPersist({'error': true, 'httpError': true, 'warn': true});
 * });
 * ```
 * @example
 <example module="patternfly.notification">

   <file name="index.html">
     <div ng-controller="NotificationDemoCtrl">
       <pf-notification-list></pf-notification-list>

       <form class="form-horizontal">
         <div class="form-group">
           <label class="col-sm-2 control-label" for="message">Message:</label>
           <div class="col-sm-10">
            <input type="text" class="form-control" ng-model="message" id="message"/>
           </div>
         </div>
         <div class="form-group">
           <label class="col-sm-2 control-label" for="type">Type:</label>
           <div class="col-sm-10">
             <div class="btn-group" uib-dropdown>
               <button type="button" uib-dropdown-toggle class="btn btn-default">
                 {{type}}
                 <span class="caret"></span>
               </button>
               <ul uib-dropdown-menu class="dropdown-menu-right" role="menu">
                 <li ng-repeat="item in types" ng-class="{'selected': item === type}">
                   <a role="menuitem" tabindex="-1" ng-click="updateType(item)">
                     {{item}}
                   </a>
                 </li>
               </ul>
             </div>
           </div>
         </div>
         <div class="form-group">
           <div class="col-sm-12">
            <button ng-click="notify()">Add notification</button>
           </div>
         </div>
       </form>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.notification' ).controller( 'NotificationDemoCtrl', function( $scope, Notifications ) {

       var typeMap = { 'Info': Notifications.info,
                       'Success': Notifications.success,
                       'Warning': Notifications.warn,
                       'Danger': Notifications.error };

       $scope.types = Object.keys(typeMap);

       $scope.type = $scope.types[0];

       $scope.updateType = function(item) {
         $scope.type = item;
       };

       $scope.message = 'Default notification message.';

       $scope.notify = function () {
         typeMap[$scope.type]($scope.message);
       }
     });
   </file>

 </example>
 */
angular.module('patternfly.notification').provider('Notifications', function () {
  'use strict';

  // time (in ms) the notifications are shown
  this.delay = 8000;
  this.verbose = true;
  this.notifications = {};
  this.notifications.data = [];
  this.persist = {'error': true, 'httpError': true};

  this.setDelay = function (delay) {
    this.delay = delay;
    return this;
  };

  this.setVerbose = function (verbose) {
    this.verbose = verbose;
    return this;
  };

  this.setPersist = function (persist) {
    this.persist = persist;
  };

  this.$get = ['$timeout', '$log', function ($timeout, $log) {
    var delay = this.delay;
    var notifications = this.notifications;
    var verbose = this.verbose;
    var persist = this.persist;

    var modes = {
      info: { type: 'info', header: 'Info!', log: 'info'},
      success: { type: 'success', header: 'Success!', log: 'info'},
      error: { type: 'danger', header: 'Error!', log: 'error'},
      warn: { type: 'warning', header: 'Warning!', log: 'warn'}
    };

    if (!notifications) {
      notifications.data = [];
    }

    notifications.message = function (type, header, message, isPersistent, closeCallback, actionTitle, actionCallback, menuActions) {
      var notification = {
        type : type,
        header: header,
        message : message,
        isPersistent: isPersistent,
        closeCallback: closeCallback,
        actionTitle: actionTitle,
        actionCallback: actionCallback,
        menuActions: menuActions
      };

      notification.show = true;
      notifications.data.push(notification);

      if (!notification.isPersistent) {
        notification.viewing = false;
        $timeout(function () {
          notification.show = false;
          if (!notification.viewing) {
            notifications.remove(notification);
          }
        }, delay);
      }
    };

    function createNotifyMethod (mode) {
      return function (message, header, persistent, closeCallback, actionTitle, actionCallback, menuActions) {
        if (angular.isUndefined(header)) {
          header = modes[mode].header;
        }
        if (angular.isUndefined(persistent)) {
          persistent = persist[mode];
        }
        notifications.message(modes[mode].type, header, message, persistent, closeCallback, actionTitle, actionCallback, menuActions);
        if (verbose) {
          $log[modes[mode].log](message);
        }
      };
    }

    angular.forEach(modes, function (mode, index) {
      notifications[index] = createNotifyMethod(index);
    });


    notifications.httpError = function (message, httpResponse) {
      message += ' (' + (httpResponse.data.message || httpResponse.data.cause || httpResponse.data.cause || httpResponse.data.errorMessage) + ')';
      notifications.message('danger', 'Error!', message, persist.httpError);
      if (verbose) {
        $log.error(message);
      }
    };

    notifications.remove = function (notification) {
      var index = notifications.data.indexOf(notification);
      if (index !== -1) {
        notifications.removeIndex(index);
      }
    };

    notifications.removeIndex = function (index) {
      //notifications.remove(index);
      notifications.data.splice(index, 1);
    };

    notifications.setViewing = function (notification, viewing) {
      notification.viewing = viewing;
      if (!viewing && !notification.show) {
        notifications.remove(notification);
      }
    };

    return notifications;
  }];

});

/**
 * @ngdoc directive
 * @name patternfly.notification.component:pfNotificationList
 * @restrict E
 *
 * @description
 * Using this component automatically creates a list of notifications generated by the {@link api/patternfly.notification.Notification notification} service.
 *
 * @example
 <example module="patternfly.notification">

   <file name="index.html">
     <div ng-controller="NotificationDemoCtrl">

       <pf-notification-list></pf-notification-list>

       <form class="form-horizontal">
         <div class="form-group">
           <label class="col-sm-2 control-label" for="type">Type:</label>
           <div class="col-sm-10">
             <div class="btn-group" uib-dropdown>
               <button type="button" uib-dropdown-toggle class="btn btn-default">
                 {{type}}
                 <span class="caret"></span>
               </button>
               <ul uib-dropdown-menu class="dropdown-menu-right" role="menu">
                 <li ng-repeat="item in types" ng-class="{'selected': item === type}">
                   <a role="menuitem" tabindex="-1" ng-click="updateType(item)">
                     {{item}}
                   </a>
                 </li>
               </ul>
             </div>
           </div>
         </div>
         <div class="form-group">
           <label class="col-sm-2 control-label" for="message">Message:</label>
           <div class="col-sm-10">
            <input type="text" class="form-control" ng-model="message" id="message"/>
           </div>
         </div>
         <div class="form-group">
           <div class="col-sm-12">
            <button ng-click="notify()">Add notification - Click me several times</button>
           </div>
         </div>
       </form>
     </div>
   </file>

   <file name="script.js">
     angular.module('patternfly.notification').controller( 'NotificationDemoCtrl', function( $scope, Notifications ) {
       $scope.message = 'Default Message.';

       var typeMap = { 'Info': Notifications.info,
                       'Success': Notifications.success,
                       'Warning': Notifications.warn,
                       'Danger': Notifications.error };

       $scope.types = Object.keys(typeMap);

       $scope.type = $scope.types[0];
       $scope.message = 'Default notification message.';

       $scope.updateType = function(item) {
         $scope.type = item;
       };

       $scope.notify = function () {
         typeMap[$scope.type]($scope.message);
       }
     });
   </file>

 </example>
 */
angular.module('patternfly.notification').component('pfNotificationList', {
  templateUrl: 'notification/notification-list.html',
  controller: ["Notifications", function (Notifications) {
    'use strict';
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.notifications = Notifications;
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.notification.component:pfToastNotificationList
 * @restrict E
 * @scope
 *
 * @param {Array} notifications The list of current notifications to display. Each notification should have the following (see pfToastNotification):
 *           <ul style='list-style-type: none'>
 *             <li>.type - (String) The type of the notification message. Allowed value is one of these: 'success','info','danger', 'warning'
 *             <li>.header - (String) The header to display for the notification (optional)
 *             <li>.message - (String) The main text message of the notification.
 *             <li>.actionTitle Text to show for the primary action, optional.
 *             <li>.actionCallback (function(this notification)) Function to invoke when primary action is selected, optional
 *             <li>.menuActions  Optional list of actions to place in the kebab menu:<br/>
 *               <ul style='list-style-type: none'>
 *                 <li>.name - (String) The name of the action, displayed on the button
 *                 <li>.actionFn - (function(action, this notification)) Function to invoke when the action selected
 *                 <li>.isDisabled - (Boolean) set to true to disable the action
 *                 <li>.isSeparator - (Boolean) set to true if this is a placehodler for a separator rather than an action
 *               </ul>
 *             <li>.isPersistent Flag to show close button for the notification even if showClose is false.
 *           </ul>
 * @param {Boolean} showClose Flag to show the close button on all notifications (not shown if the notification has menu actions)
 * @param {function} closeCallback (function(data)) Function to invoke when closes a toast notification
 * @param {function} updateViewing (function(boolean, data)) Function to invoke when user is viewing/not-viewing (hovering on) a toast notification
 *
 * @description
 * Using this component displayes a list of toast notifications
 *
 * @example
 <example module="patternfly.notification">

   <file name="index.html">
     <div ng-controller="ToastNotificationListDemoCtrl" >
       <pf-toast-notification-list notifications="notifications" show-close="showClose" close-callback="handleClose" update-viewing="updateViewing"></pf-toast-notification-list>
       <div class="row example-container">
         <div class="col-md-12">
           <form class="form-horizontal">
             <div class="form-group">
               <label class="col-sm-3 control-label" for="type">Show Close buttons:</label>
               <div class="col-sm-1">
                 <input type="checkbox" ng-model="showClose"/>
               </div>
             </div>
             <div class="form-group">
               <label class="col-sm-2 control-label" for="type">Type:</label>
               <div class="col-sm-10">
                 <div class="btn-group" uib-dropdown>
                   <button type="button" uib-dropdown-toggle class="btn btn-default">
                     {{type}}
                     <span class="caret"></span>
                   </button>
                   <ul uib-dropdown-menu class="dropdown-menu-right" role="menu">
                     <li ng-repeat="item in types" ng-class="{'selected': item === type}">
                       <a role="menuitem" tabindex="-1" ng-click="updateType(item)">
                         {{item}}
                       </a>
                     </li>
                   </ul>
                 </div>
               </div>
             </div>
             <div class="form-group">
               <label class="col-sm-2 control-label" for="header">Header:</label>
               <div class="col-sm-10">
                 <input type="text" class="form-control" ng-model="header" id="header"/>
               </div>
             </div>
             <div class="form-group">
               <label class="col-sm-2 control-label" for="message">Message:</label>
               <div class="col-sm-10">
                <input type="text" class="form-control" ng-model="message" id="message"/>
               </div>
             </div>
             <div class="form-group">
               <label class="col-sm-2 control-label" for="message">Primary Action:</label>
               <div class="col-sm-10">
                 <input type="text" class="form-control" ng-model="primaryAction" id="primaryAction"/>
               </div>
             </div>
             <div class="form-group">
               <label class="col-sm-2 control-label" for="type">Persistent:</label>
               <div class="col-sm-1">
                 <input type="checkbox" ng-model="persistent"/>
               </div>
               <label class="col-sm-2 control-label" for="type">Show Menu:</label>
               <div class="col-sm-2">
                 <input type="checkbox" ng-model="showMenu"/>
               </div>
             </div>
             <div class="form-group">
               <div class="col-sm-12">
                 <button ng-click="notify()">Add notification - Click me several times</button>
               </div>
             </div>
           </form>
         </div>
         <div class="col-md-12">
           <label class="actions-label">Actions: </label>
         </div>
         <div class="col-md-12">
           <textarea rows="3" class="col-md-12">{{actionText}}</textarea>
         </div>
       </div>
     </div>
   </file>

   <file name="script.js">
     angular.module('patternfly.notification').controller( 'ToastNotificationListDemoCtrl', function( $scope, $rootScope, Notifications ) {
       $scope.message = 'Default Message.';

       var typeMap = { 'Info': 'info',
                       'Success': 'success',
                       'Warning': 'warning',
                       'Danger': 'danger' };

       $scope.types = Object.keys(typeMap);

       $scope.type = $scope.types[0];
       $scope.header = 'Default header.';
       $scope.message = 'Default notification message.';
       $scope.showClose = false;
       $scope.persistent = false;

       $scope.primaryAction = '';

       $scope.updateType = function(item) {
         $scope.type = item;
       };

       $scope.showMenu = false;
       var performAction = function (menuAction, data) {
         $scope.actionText += menuAction.name +  ": " + data.message + '\n';
       };
       $scope.menuActions = [
          {
            name: 'Action',
            title: 'Perform an action',
            actionFn: performAction
          },
          {
            name: 'Another Action',
            title: 'Do something else',
            actionFn: performAction
          },
          {
            name: 'Disabled Action',
            title: 'Unavailable action',
            actionFn: performAction,
            isDisabled: true
          },
          {
            name: 'Something Else',
            title: '',
            actionFn: performAction
          },
          {
            isSeparator: true
          },
          {
            name: 'Grouped Action 1',
            title: 'Do something',
            actionFn: performAction
          },
          {
            name: 'Grouped Action 2',
            title: 'Do something similar',
            actionFn: performAction
          }
        ];

       $scope.actionText = "";

       $scope.handleAction = function (data) {
         $scope.actionText = $scope.primaryAction + ": " + data.message + '\n' + $scope.actionText;
       };
       $scope.handleClose = function (data) {
         $scope.actionText = "Closed: " + data.message + '\n'+ $scope.actionText;
         Notifications.remove(data);
       };
       $scope.updateViewing = function (viewing, data) {
         Notifications.setViewing(data, viewing);
       };

       $scope.notify = function () {
         Notifications.message (
           typeMap[$scope.type],
           $scope.header,
           $scope.message,
           $scope.persistent,
           $scope.handleClose,
           $scope.primaryAction,
           $scope.handleAction,
           ($scope.showMenu ? $scope.menuActions : undefined)
         );
       }

       $scope.notifications = Notifications.data;
     });
   </file>

 </example>
 */
angular.module('patternfly.notification').component('pfToastNotificationList', {
  bindings: {
    notifications: '=',
    showClose: '=?',
    closeCallback: '=?',
    updateViewing: '=?'
  },
  templateUrl: 'notification/toast-notification-list.html',
  controller: function () {
    'use strict';
    var ctrl = this;

    ctrl.handleClose = function (notification) {
      if (angular.isFunction(ctrl.closeCallback)) {
        ctrl.closeCallback(notification);
      }
    };
    ctrl.handleViewingChange = function (isViewing, notification) {
      if (angular.isFunction(ctrl.updateViewing)) {
        ctrl.updateViewing(isViewing, notification);
      }
    };
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.notification.component:pfToastNotification
 * @restrict E
 * @scope
 *
 * @param {string} notificationType The type of the notification message. Allowed value is one of these: 'success','info','danger', 'warning'
 * @param {string} header The header text of the notification.
 * @param {string} message The main text message of the notification.
 * @param {boolean} showClose Flag to show the close button, default: true
 * @param {function} closeCallback (function(data)) Function to invoke when close action is selected, optional
 * @param {string} actionTitle Text to show for the primary action, optional.
 * @param {function} actionCallback (function(data)) Function to invoke when primary action is selected, optional
 * @param {Array} menuActions  Optional list of actions to place in the kebab menu:<br/>
 *           <ul style='list-style-type: none'>
 *             <li>.name - (String) The name of the action, displayed on the button
 *             <li>.actionFn - (function(action, data)) Function to invoke when the action selected
 *             <li>.isDisabled - (Boolean) set to true to disable the action
 *             <li>.isSeparator - (Boolean) set to true if this is a placehodler for a separator rather than an action
 *           </ul>
 * @param {function} updateViewing (function(boolean, data)) Function to invoke when user is viewing/no-viewing (hovering on) the toast
 * @param {object} data Any data needed by the callbacks (optional)
 *
 * @description
 * Toast notifications are used to notify users of a system occurence. Toast notifications should be transient and stay on the screen for 8 seconds,
 * so that they do not block the information behind them for too long, but allows the user to read the message.
 * The pfToastNotification directive allows status, header, message, primary action and menu actions for the notification. The notification can also
 * allow the user to close the notification.
 *
 * Note: Using the kebab menu (menu actions) with the close button is not currently supported. If both are specified the close button will not be shown.
 * Add a close menu item if you want to have both capabilities.
 *
 * @example
 <example module="patternfly.notification">

   <file name="index.html">
     <div ng-controller="ToastNotificationDemoCtrl" class="row example-container">
       <div class="col-md-12">
         <pf-toast-notification notification-type="{{type}}" header="{{header}}" message="{{message}}"
              show-close="{{showClose}}" close-callback="closeCallback"
              action-title="{{primaryAction}}" action-callback="handleAction"
              menu-actions="menuActions">
         </pf-toast-notification>

         <form class="form-horizontal">
           <div class="form-group">
             <label class="col-sm-2 control-label" for="header">Header:</label>
             <div class="col-sm-10">
              <input type="text" class="form-control" ng-model="header" id="header"/>
             </div>
           </div>
           <div class="form-group">
             <label class="col-sm-2 control-label" for="message">Message:</label>
             <div class="col-sm-10">
               <input type="text" class="form-control" ng-model="message" id="message"/>
             </div>
           </div>
           <div class="form-group">
             <label class="col-sm-2 control-label" for="message">Primary Action:</label>
             <div class="col-sm-10">
              <input type="text" class="form-control" ng-model="primaryAction" id="primaryAction"/>
             </div>
           </div>
           <div class="form-group">
             <label class="col-sm-2 control-label" for="type">Type:</label>
             <div class="col-sm-10">
               <div class="btn-group" uib-dropdown>
                 <button type="button" uib-dropdown-toggle class="btn btn-default">
                   {{type}}
                   <span class="caret"></span>
                 </button>
                 <ul uib-dropdown-menu class="dropdown-menu-right" role="menu">
                   <li ng-repeat="item in types" ng-class="{'selected': item === type}">
                     <a role="menuitem" tabindex="-1" ng-click="updateType(item)">
                       {{item}}
                     </a>
                   </li>
                 </ul>
               </div>
             </div>
           </div>
           <div class="form-group">
             <label class="col-sm-2 control-label" for="type">Show Close:</label>
             <div class="col-sm-3">
             <input type="checkbox" ng-model="showClose"/>
             </div>
             <label class="col-sm-2 control-label" for="type">Show Menu:</label>
             <div class="col-sm-3">
              <input type="checkbox" ng-model="showMenu"/>
             </div>
           </div>
         </form>
       </div>
       <div class="col-md-12">
         <label class="actions-label">Actions: </label>
       </div>
       <div class="col-md-12">
         <textarea rows="3" class="col-md-12">{{actionText}}</textarea>
       </div>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.notification' ).controller( 'ToastNotificationDemoCtrl', function( $scope, Notifications ) {
       $scope.types = ['success','info','danger', 'warning'];
       $scope.type = $scope.types[0];
       $scope.showClose = false;

       $scope.header = 'Default Header.';
       $scope.message = 'Default Message.';
       $scope.primaryAction = '';

       $scope.updateType = function(item) {
         $scope.type = item;
       };

       $scope.showMenu = false;
       var performAction = function (menuAction) {
         $scope.actionText += menuAction.name + '\n';
       };
       var menuActions = [
          {
            name: 'Action',
            title: 'Perform an action',
            actionFn: performAction
          },
          {
            name: 'Another Action',
            title: 'Do something else',
            actionFn: performAction
          },
          {
            name: 'Disabled Action',
            title: 'Unavailable action',
            actionFn: performAction,
            isDisabled: true
          },
          {
            name: 'Something Else',
            title: '',
            actionFn: performAction
          },
          {
            isSeparator: true
          },
          {
            name: 'Grouped Action 1',
            title: 'Do something',
            actionFn: performAction
          },
          {
            name: 'Grouped Action 2',
            title: 'Do something similar',
            actionFn: performAction
          }
        ];

       $scope.$watch('showMenu',  function () {
          if ($scope.showMenu) {
            $scope.menuActions = menuActions;
          } else {
            $scope.menuActions = undefined;
          }
       });

       $scope.actionText = "";

       $scope.handleAction = function () {
         $scope.actionText = $scope.primaryAction + '\n' + $scope.actionText;
       };
       $scope.closeCallback = function () {
         $scope.actionText = "Close" + '\n' + $scope.actionText;
       };
     });
   </file>

 </example>
 */
angular.module( 'patternfly.notification' ).component('pfToastNotification', {
  bindings: {
    'notificationType': '@',
    'message': '@',
    'header': '@',
    'showClose': '@',
    'closeCallback': '=?',
    'actionTitle': '@',
    'actionCallback': '=?',
    'menuActions': '<?',
    'updateViewing': '=?',
    'data': '=?'
  },
  templateUrl: 'notification/toast-notification.html',
  controller: function () {
    'use strict';
    var ctrl = this,
      _showClose;

    Object.defineProperty(ctrl, 'showClose', {
      get: function () {
        return _showClose;
      },
      set: function (value) {
        _showClose = value;
        ctrl.updateShowClose();
      }
    });

    ctrl.notificationType = ctrl.notificationType || 'info';

    ctrl.updateShowClose = function () {
      ctrl.showCloseButton = (ctrl.showClose === 'true') && (angular.isUndefined(ctrl.menuActions) || ctrl.menuActions.length < 1);
    };

    ctrl.handleClose = function () {
      if (angular.isFunction(ctrl.closeCallback)) {
        ctrl.closeCallback(ctrl.data);
      }
    };

    ctrl.handleAction = function () {
      if (angular.isFunction(ctrl.actionCallback)) {
        ctrl.actionCallback(ctrl.data);
      }
    };

    ctrl.handleMenuAction = function (menuAction) {
      if (menuAction && angular.isFunction(menuAction.actionFn) && (menuAction.isDisabled !== true)) {
        menuAction.actionFn(menuAction, ctrl.data);
      }
    };

    ctrl.handleEnter = function () {
      if (angular.isFunction(ctrl.updateViewing)) {
        ctrl.updateViewing(true, ctrl.data);
      }
    };
    ctrl.handleLeave = function () {
      if (angular.isFunction(ctrl.updateViewing)) {
        ctrl.updateViewing(false, ctrl.data);
      }
    };

    ctrl.$onInit = function () {
      ctrl.updateShowClose();
    };

    ctrl.$onChanges = function (changesObj) {
      if (changesObj.menuActions) {
        ctrl.updateShowClose();
      }
    };
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.select.component:pfSelect
 * @restrict E
 *
 * @param {object} selected Curently selected value
 * @param {object} options Array of valid selections
 * @param {string} displayField Field from the object in the array to display for selection (optional)
 * @param {string} emptyValue value to display when nothing is selected
 * @param {function(item)} onSelect Function to call upon user selection of an item.
 *
 * @description
 * The pfSelect component provides a wrapper for the angular ui bootstrap dropdown container allowing for use of ng-model and ng-options
 *
 * @example
 <example module="patternfly.select">
 <file name="index.html">
   <div ng-controller="SelectDemoCtrl">
     <form class="form-horizontal">
       <div class="form-group">
         <label class="col-sm-2 control-label">Preferred pet:</label>
         <div class="col-sm-10">
           <pf-select selected="pet" empty-value="{{noPet}}" options="pets"></pf-select>
         </div>
       </div>
       <div class="form-group">
         <label class="col-sm-2 control-label">Preferred fruit:</label>
         <div class="col-sm-10">
           <pf-select selected="fruit" options="fruits" display-field="title"></pf-select>
         </div>
       </div>
       <div class="form-group">
         <label class="col-sm-2 control-label">Preferred drink:</label>
         <div class="col-sm-10">
           <pf-select selected="drink" empty-value="{{noDrink}}" options="drinks" display-field="name"></pf-select>
         </div>
       </div>
     </form>
     <p>Your preferred pet is {{pet || noPet}}.</p>
     <p>Your preferred drink is {{fruit.name}}.</p>
     <p>Your preferred drink is {{drink ? drink.name : noDrink}}.</p>
   </div>
   </file>
 <file name="script.js">
   angular.module( 'patternfly.select' ).controller( 'SelectDemoCtrl', function( $scope ) {
         $scope.pets = ['Dog', 'Cat', 'Chicken'];
         $scope.noPet = "No pet selected";

         $scope.fruits = [
           { id: 1, name:'orange', title: 'Oranges - fresh from Florida'},
           { id: 2, name:'apple', title: 'Apples - Macintosh, great for pies.'},
           { id: 3, name:'banana', title: 'Bananas - you will go ape for them!' }
         ];
         $scope.fruit = $scope.fruits[0];

         $scope.drinks = [
           { id: 1, name:'tea'},
           { id: 2, name:'coffee'},
           { id: 3, name:'water'},
           { id: 4, name:'wine'},
           { id: 5, name:'beer'}
         ];
         $scope.drink = $scope.drinks[0];
         $scope.noDrink = "No drink selected";
       });
   </file>
 </example>
 */
;angular.module('patternfly.select').component('pfSelect', {

  bindings: {
    selected: '=',
    options: '<',
    displayField: '@',
    emptyValue: '@',
    onSelect: '<'
  },
  templateUrl: 'select/select.html',
  controller: function () {
    'use strict';

    var ctrl = this;

    ctrl.$onInit = function () {
      angular.extend(ctrl, {
        showEmpty: angular.isDefined(ctrl.emptyValue),
        getDisplayValue: getDisplayValue,
        selectItem: selectItem
      });
    };

    function getDisplayValue (item) {
      var value;

      if (item !== ctrl.emptyValue && angular.isString(ctrl.displayField)) {
        value = item[ctrl.displayField];
      } else {
        value = item;
      }

      return value;
    }

    function selectItem (item) {
      ctrl.selected = item;
      if (angular.isFunction(ctrl.onSelect)) {
        ctrl.onSelect(item);
      }
    }
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.sort.component:pfSort
 * @restrict E
 *
 * @description
 *   Sort component
 *   <br><br>
 *
 * @param {object} config configuration settings for the sort:<br/>
 * <ul style='list-style-type: none'>
 * <li>.fields          - (Array) List of sortable fields containing:
 * <ul style='list-style-type: none'>
 * <li>.id          - (String) Unique Id for the sort field
 * <li>.title       - (String) The title to display for the sort field
 * <li>.sortType    - (String) The sort type, 'alpha' or 'numeric'
 * </ul>
 * <li>.currentField   - (Object) Currently selected field
 * <li>.isAscending - (boolean) Current sort direction is ascending. True for ascending, False for descending
 * <li>.onSortChange - ( function(sortId, sortDirection ) Function to call when the current sort params change
 * </ul>
 *
 * @example
<example module="patternfly.sort">
  <file name="index.html">
    <div ng-controller="ViewCtrl" class="row example-container">
      <div class="col-md-12">
        <pf-sort id="exampleSort" config="sortConfig"></pf-sort>
      </div>
      <hr class="col-md-12">
      <div class="col-md-12">
        <label class="events-label">Items: </label>
      </div>
      <div class="col-md-12">
        <div ng-repeat="item in items" class="col-md-12 cfme-row-column">
          <div class="row">
            <div class="col-md-3">
              <span>{{item.name}}</span>
            </div>
            <div class="col-md-3">
              <span>{{item.count}}</span>
            </div>
            <div class="col-md-3">
              <span>{{item.description}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </file>

  <file name="script.js">
    angular.module('patternfly.sort').controller('ViewCtrl', ['$scope',
      function ($scope) {
        $scope.items = [
          {
            name: "Item 7",
            count: 432,
            description: 'Very nice item'
          },
          {
            name: "Item 6",
            count: 22,
            description: 'It lasts forever'
          },
          {
            name: "Item 3",
            count: 632,
            description: 'Good stuff cheap'
          },
          {
            name: "Item 2",
            count: 12,
            description: 'Fantastic'
          },
          {
            name: "Item 9",
            count: 99,
            description: 'It does alright'
          },
          {
            name: "Item 4",
            count: 442,
            description: 'Horrible'
          },
          {
            name: "Item 1",
            count: 42,
            description: 'Most excellent'
          },
          {
            name: "Item 8",
            count: 2,
            description: 'Get it while it lasts'
          },
          {
            name: "Item 5",
            count: 321,
            description: 'Beautiful style'
          }
        ];

        var compareFn = function(item1, item2) {
          var compValue = 0;
          if ($scope.sortConfig.currentField.id === 'name') {
            compValue = item1.name.localeCompare(item2.name);
          } else if ($scope.sortConfig.currentField.id === 'count') {
              compValue = item1.count - item2.count;
          } else if ($scope.sortConfig.currentField.id === 'description') {
            compValue = item1.description.localeCompare(item2.description);
          }

          if (!$scope.sortConfig.isAscending) {
            compValue = compValue * -1;
          }

          return compValue;
        };

        var sortChange = function (sortId, isAscending) {
          $scope.items.sort(compareFn);
        };

        $scope.sortConfig = {
          fields: [
            {
              id: 'name',
              title:  'Name',
              sortType: 'alpha'
            },
            {
              id: 'count',
              title:  'Count',
              sortType: 'numeric'
            },
            {
              id: 'description',
              title:  'Description',
              sortType: 'alpha'
            }
          ],
          onSortChange: sortChange
        };
      }
    ]);
  </file>
</example>
 */
;angular.module('patternfly.sort').component('pfSort', {
  bindings: {
    config: '='
  },
  templateUrl: 'sort/sort.html',
  controller: function () {
    'use strict';

    var ctrl = this;
    var prevConfig;

    ctrl.$onInit = function () {
      if (angular.isDefined(ctrl.config) && angular.isUndefined(ctrl.config.show)) {
        // default to true
        ctrl.config.show = true;
      }

      angular.extend(ctrl, {
        selectField: selectField,
        changeDirection: changeDirection,
        getSortIconClass: getSortIconClass
      });
    };

    ctrl.$onChanges = function () {
      setupConfig();
    };

    ctrl.$doCheck = function () {
      // do a deep compare on config
      if (!angular.equals(ctrl.config, prevConfig)) {
        setupConfig();
      }
    };

    function setupConfig () {
      var updated = false;

      prevConfig = angular.copy(ctrl.config);

      if (ctrl.config.fields === undefined) {
        ctrl.config.fields = [];
      }

      if (ctrl.config.fields.length > 0) {
        if (ctrl.config.currentField === undefined) {
          ctrl.config.currentField = ctrl.config.fields[0];
          updated = true;
        }
        if (ctrl.config.isAscending === undefined) {
          ctrl.config.isAscending = true;
          updated = true;
        }
      }

      if (updated === true && ctrl.config.onSortChange) {
        ctrl.config.onSortChange(ctrl.config.currentField, ctrl.config.isAscending);
      }
    }

    function selectField (field) {
      ctrl.config.currentField = field;

      if (ctrl.config.onSortChange) {
        ctrl.config.onSortChange(ctrl.config.currentField, ctrl.config.isAscending);
      }
    }

    function changeDirection () {
      ctrl.config.isAscending = !ctrl.config.isAscending;

      if (ctrl.config.onSortChange) {
        ctrl.config.onSortChange(ctrl.config.currentField, ctrl.config.isAscending);
      }
    }

    function getSortIconClass () {
      var iconClass;

      if (ctrl.config.currentField.sortType === 'numeric') {
        if (ctrl.config.isAscending) {
          iconClass = 'fa fa-sort-numeric-asc';
        } else {
          iconClass = 'fa fa-sort-numeric-desc';
        }
      } else {
        if (ctrl.config.isAscending) {
          iconClass = 'fa fa-sort-alpha-asc';
        } else {
          iconClass = 'fa fa-sort-alpha-desc';
        }
      }

      return iconClass;
    }
  }
});
;/**
  * @ngdoc directive
  * @name patternfly.table.component:pfTableView - Basic
  *
  * @description
  * Component for rendering a simple table view.<br><br>
  * See {@link patternfly.table.component:pfTableView%20-%20with%20Toolbar pfTableView - with Toolbar} for use with a Toolbar<br>
  * See {@link patternfly.toolbars.componenet:pfToolbar pfToolbar} for use in Toolbar View Switcher
  *
  * @param {object} config Optional configuration object
  * <ul style='list-style-type: none'>
  *   <li>.selectionMatchProp  - (string) Property of the items to use for determining matching, default is 'uuid'
  *   <li>.onCheckBoxChange    - ( function(item) ) Called to notify when a checkbox selection changes, default is none
  *   <li>.itemsAvailable      - (boolean) If 'false', displays the {@link patternfly.views.component:pfEmptyState Empty State} component.
  * </ul>
  * @param {object} dtOptions Optional angular-datatables DTOptionsBuilder configuration object.  See {@link http://l-lin.github.io/angular-datatables/archives/#/api angular-datatables: DTOptionsBuilder}
  * @param {array} items Array of items to display in the table view.
  * @param {array} columns Array of table column information to display in the table's header row
  * <ul style='list-style-type: none'>
  *   <li>.header     - (string) Text label for a column header
  *   <li>.itemField    - (string) Item field to associate with a particular column.
  * </ul>
  * @param {array} actionButtons List of action buttons in each row
  *   <ul style='list-style-type: none'>
  *     <li>.name - (String) The name of the action, displayed on the button
  *     <li>.title - (String) Optional title, used for the tooltip
  *     <li>.actionFn - (function(action)) Function to invoke when the action selected
  *   </ul>
  * @param {array} menuActions List of actions for dropdown menu in each row
  *   <ul style='list-style-type: none'>
  *     <li>.name - (String) The name of the action, displayed on the button
  *     <li>.title - (String) Optional title, used for the tooltip
  *     <li>.actionFn - (function(action)) Function to invoke when the action selected
  *   </ul>
  * @param {object} emptyStateConfig Optional configuration settings for the empty state component.  See the {@link patternfly.views.component:pfEmptyState Empty State} component
  * @example
 <example module="patternfly.tableview.demo">
 <file name="index.html">
 <div ng-controller="TableCtrl" class="row example-container">
   <div class="col-md-12">
     <pf-table-view id="exampleTableView"
          config="config"
          empty-state-config="emptyStateConfig"
          dt-options="dtOptions"
          colummns="colummns"
          items="items"
          action-buttons="actionButtons"
          menu-actions="menuActions">
     </pf-table-view>
   </div>
   <div class="col-md-12" style="padding-top: 12px;">
     <div class="form-group">
       <label class="checkbox-inline">
         <input type="checkbox" ng-model="config.itemsAvailable">Items Available</input>
       </label>
     </div>
   </div>
   <hr class="col-md-12">
   <div class="col-md-12">
         <div class="col-md-12" style="padding-top: 12px;">
           <label style="font-weight:normal;vertical-align:center;">Events: </label>
         </div>
         <div class="col-md-12">
           <textarea rows="10" class="col-md-12">{{eventText}}</textarea>
         </div>
   </div>
 </file>

 <file name="modules.js">
   angular.module('patternfly.tableview.demo', ['patternfly.views','patternfly.table']);
 </file>

 <file name="script.js">
 angular.module('patternfly.tableview.demo').controller('TableCtrl', ['$scope',
 function ($scope) {
        $scope.dtOptions = {
          order: [[2, "asc"]],
        };

        $scope.colummns = [
          { header: "Name", itemField: "name" },
          { header: "Address", itemField: "address"},
          { header: "City", itemField: "city" },
          { header: "State", itemField: "state"}
        ];

        $scope.items = [
          {
            name: "Fred Flintstone",
            address: "20 Dinosaur Way",
            city: "Bedrock",
            state: "Washingstone"
          },
          {
            name: "John Smith",
            address: "415 East Main Street",
            city: "Norfolk",
            state: "Virginia",
          },
          {
            name: "Frank Livingston",
            address: "234 Elm Street",
            city: "Pittsburgh",
            state: "Pennsylvania"
          },
          {
            name: "Linda McGovern",
            address: "22 Oak Street",
            city: "Denver",
            state: "Colorado"
          },
          {
            name: "Jim Brown",
            address: "72 Bourbon Way",
            city: "Nashville",
            state: "Tennessee"
          },
          {
            name: "Holly Nichols",
            address: "21 Jump Street",
            city: "Hollywood",
            state: "California"
          },
          {
            name: "Marie Edwards",
            address: "17 Cross Street",
            city: "Boston",
            state: "Massachusetts"
          },
          {
            name: "Pat Thomas",
            address: "50 Second Street",
            city: "New York",
            state: "New York"
          },
        ];

        $scope.eventText = "";

        $scope.config = {
          onCheckBoxChange: handleCheckBoxChange,
          selectionMatchProp: "name",
          itemsAvailable: true
        };

        $scope.emptyStateConfig = {
          icon: 'pficon-warning-triangle-o',
          title: 'No Items Available',
          info: "This is the Empty State component. The goal of a empty state pattern is to provide a good first impression that helps users to achieve their goals. It should be used when a view is empty because no objects exists and you want to guide the user to perform specific actions.",
          helpLink: {
             label: 'For more information please see',
             urlLabel: 'pfExample',
             url : '#/api/patternfly.views.component:pfEmptyState'
          }
        };

        function handleCheckBoxChange (item) {
          $scope.eventText = item.name + ' checked: ' + item.selected + '\r\n' + $scope.eventText;
        };

        var performAction = function (action, item) {
          $scope.eventText = item.name + " : " + action.name + "\r\n" + $scope.eventText;
        };

        $scope.actionButtons = [
          {
            name: 'Action',
            title: 'Perform an action',
            actionFn: performAction
          }
        ];

        $scope.menuActions = [
          {
            name: 'Action',
            title: 'Perform an action',
            actionFn: performAction
          },
          {
            name: 'Another Action',
            title: 'Do something else',
            actionFn: performAction
          },
          {
            name: 'Disabled Action',
            title: 'Unavailable action',
            actionFn: performAction,
            isDisabled: true
          },
          {
            name: 'Something Else',
            title: '',
            actionFn: performAction
          },
          {
            isSeparator: true
          },
          {
            name: 'Grouped Action 1',
            title: 'Do something',
            actionFn: performAction
          },
          {
            name: 'Grouped Action 2',
            title: 'Do something similar',
            actionFn: performAction
          }
        ];
      }
    ]);
  </file>
</example>
*/
;/**
 * @ngdoc directive
 * @name patternfly.table.component:pfTableView - with Toolbar
 *
 * @description
 * Example configuring a table view with a toolbar.<br><br>
 * Please see {@link patternfly.toolbars.componenet:pfToolbar pfToolbar} for use in Toolbar View Switcher
 *
 * @param {object} config Optional configuration object
 * <ul style='list-style-type: none'>
 *   <li>.selectionMatchProp  - (string) Property of the items to use for determining matching, default is 'uuid'
 *   <li>.onCheckBoxChange    - ( function(item) ) Called to notify when a checkbox selection changes, default is none
 *   <li>.itemsAvailable      - (boolean) If 'false', displays the {@link patternfly.views.component:pfEmptyState Empty State} component.
 * </ul>
 * @param {object} dtOptions Optional angular-datatables DTOptionsBuilder configuration object.  See {@link http://l-lin.github.io/angular-datatables/archives/#/api angular-datatables: DTOptionsBuilder}
 * @param {array} items Array of items to display in the table view.
 * @param {array} columns Array of table column information to display in the table's header row
 * <ul style='list-style-type: none'>
 *   <li>.header     - (string) Text label for a column header
 *   <li>.itemField    - (string) Item field to associate with a particular column.
 * </ul>
 * @param {array} actionButtons List of action buttons in each row
 *   <ul style='list-style-type: none'>
 *     <li>.name - (String) The name of the action, displayed on the button
 *     <li>.title - (String) Optional title, used for the tooltip
 *     <li>.actionFn - (function(action)) Function to invoke when the action selected
 *   </ul>
 * @param {array} menuActions List of actions for dropdown menu in each row
 *   <ul style='list-style-type: none'>
 *     <li>.name - (String) The name of the action, displayed on the button
 *     <li>.title - (String) Optional title, used for the tooltip
 *     <li>.actionFn - (function(action)) Function to invoke when the action selected
 *   </ul>
 * @param {object} emptyStateConfig Optional configuration settings for the empty state component.  See the {@link patternfly.views.component:pfEmptyState Empty State} component
 * @example
<example module="patternfly.tableview.demo">
  <file name="index.html">
    <div ng-controller="ViewCtrl" class="row example-container">
      <div class="col-md-12">
        <pf-toolbar id="exampleToolbar" config="toolbarConfig"></pf-toolbar>
      </div>
      <div class="col-md-12">
        <pf-table-view config="tableConfig"
                       empty-state-config="emptyStateConfig"
                       dt-options="dtOptions"
                       colummns="colummns"
                       items="items"
                       action-buttons="tableActionButtons"
                       menu-actions="tableMenuActions">
        </pf-table-view>
      </div>
      <div class="col-md-12">
        <div class="form-group">
          <label class="checkbox-inline">
            <input type="checkbox" ng-model="tableConfig.itemsAvailable" ng-change="updateItemsAvailable()">Items Available</input>
          </label>
          <!-- //[WIP] issues dynamically changing displayLength and turning on/off pagination
            <label class="checkbox-inline">
              <input type="checkbox" ng-model="usePagination" ng-change="togglePagination()">Use Pagination</input>
            </label>
            <label>
              <input ng-model="dtOptions.displayLength" ng-disabled="!usePagination" style="width: 24px; padding-left: 6px;"> # Rows Per Page</input>
            </label> --!>
        </div>
      </div>
      <hr class="col-md-12">
      <div class="col-md-12">
        <label class="actions-label">Actions: </label>
      </div>
      <div class="col-md-12">
        <textarea rows="6" class="col-md-12">{{actionsText}}</textarea>
      </div>
    </div>
  </file>

  <file name="modules.js">
    angular.module('patternfly.tableview.demo', ['patternfly.toolbars','patternfly.table']);
  </file>

  <file name="script.js">
  angular.module('patternfly.tableview.demo').controller('ViewCtrl', ['$scope', 'pfViewUtils', '$filter',
    function ($scope, pfViewUtils, $filter) {
      $scope.actionsText = "";

      $scope.colummns = [
        { header: "Name", itemField: "name" },
        { header: "Age", itemField: "age"},
        { header: "Address", itemField: "address" },
        { header: "BirthMonth", itemField: "birthMonth"}
      ];

      $scope.dtOptions = {
        paginationType: 'full',
        displayLength: 10,
        dom: "tp"
      };

      // [WIP] attempt to dyamically change displayLength (#rows) and turn on/off pagination controls
      // See: issues turning on/off pagination. see: https://datatables.net/manual/tech-notes/3

      $scope.usePagination = true;
      $scope.togglePagination = function () {
        $scope.usePagination = !$scope.usePagination;
        console.log("---> togglePagination: " + $scope.usePagination);
        if($scope.usePagination) {
          $scope.dtOptions.displayLength = 3;
          $scope.dtOptions.dom = "tp";
          console.log("---> use pagination: " + $scope.dtOptions.displayLength + ":" + $scope.dtOptions.dom);
        } else {
          $scope.dtOptions.displayLength = undefined;
          $scope.dtOptions.dom = "t";
        }
      };

      $scope.allItems = [
        {
          name: "Fred Flintstone",
          age: 57,
          address: "20 Dinosaur Way, Bedrock, Washingstone",
          birthMonth: 'February'
        },
        {
          name: "John Smith",
          age: 23,
          address: "415 East Main Street, Norfolk, Virginia",
          birthMonth: 'October'
        },
        {
          name: "Frank Livingston",
          age: 71,
          address: "234 Elm Street, Pittsburgh, Pennsylvania",
          birthMonth: 'March'
        },
        {
          name: "Judy Green",
          age: 21,
          address: "2 Apple Boulevard, Cincinatti, Ohio",
          birthMonth: 'December'
        },
        {
          name: "Pat Thomas",
          age: 19,
          address: "50 Second Street, New York, New York",
          birthMonth: 'February'
        },
        {
          name: "Linda McGovern",
          age: 32,
          address: "22 Oak Stree, Denver, Colorado",
          birthMonth: 'March'
        },
        {
          name: "Jim Brown",
          age: 55,
          address: "72 Bourbon Way. Nashville. Tennessee",
          birthMonth: 'March'
        },
        {
          name: "Holly Nichols",
          age: 34,
          address: "21 Jump Street, Hollywood, California",
          birthMonth: 'March'
        },
        {
          name: "Wilma Flintstone",
          age: 47,
          address: "20 Dinosaur Way, Bedrock, Washingstone",
          birthMonth: 'February'
        },
        {
          name: "Jane Smith",
          age: 22,
          address: "415 East Main Street, Norfolk, Virginia",
          birthMonth: 'April'
        },
        {
          name: "Liz Livingston",
          age: 65,
          address: "234 Elm Street, Pittsburgh, Pennsylvania",
          birthMonth: 'November'
        },
        {
          name: "Jim Green",
          age: 23,
          address: "2 Apple Boulevard, Cincinatti, Ohio",
          birthMonth: 'January'
        },
        {
          name: "Chris Thomas",
          age: 21,
          address: "50 Second Street, New York, New York",
          birthMonth: 'October'
        },
        {
          name: "Larry McGovern",
          age: 34,
          address: "22 Oak Stree, Denver, Colorado",
          birthMonth: 'September'
        },
        {
          name: "July Brown",
          age: 51,
          address: "72 Bourbon Way. Nashville. Tennessee",
          birthMonth: 'May'
        },
        {
          name: "Henry Nichols",
          age: 36,
          address: "21 Jump Street, Hollywood, California",
          birthMonth: 'March'
        },
      ];

      $scope.items = $scope.allItems;

      var matchesFilter = function (item, filter) {
        var match = true;

        if (filter.id === 'name') {
          match = item.name.match(filter.value) !== null;
        } else if (filter.id === 'age') {
          match = item.age === parseInt(filter.value);
        } else if (filter.id === 'address') {
          match = item.address.match(filter.value) !== null;
        } else if (filter.id === 'birthMonth') {
          match = item.birthMonth === filter.value;
        }
        return match;
      };

      var matchesFilters = function (item, filters) {
        var matches = true;

        filters.forEach(function(filter) {
          if (!matchesFilter(item, filter)) {
            matches = false;
            return false;
          }
        });
        return matches;
      };

      var applyFilters = function (filters) {
        $scope.items = [];
        if (filters && filters.length > 0) {
          $scope.allItems.forEach(function (item) {
            if (matchesFilters(item, filters)) {
              $scope.items.push(item);
            }
          });
        } else {
          $scope.items = $scope.allItems;
        }
      };

      var filterChange = function (filters) {
        applyFilters(filters);
        $scope.toolbarConfig.filterConfig.resultsCount = $scope.items.length;
      };

      var performAction = function (action) {
        var selectedItems = $filter('filter')($scope.allItems, {selected: true});
        if(!selectedItems) {
          selectedItems = [];
        }
        $scope.actionsText = "Toolbar Action: " + action.name + " on " + selectedItems.length + " selected items\n" + $scope.actionsText;
      };

      var performTableAction = function (action, item) {
        $scope.actionsText = "Table Row Action on '" + item.name + "' : " + action.name + "\r\n" + $scope.actionsText;
      };

      function handleCheckBoxChange (item) {
        var selectedItems = $filter('filter')($scope.allItems, {selected: true});
        if (selectedItems) {
          $scope.toolbarConfig.filterConfig.selectedCount = selectedItems.length;
        }
      }

      $scope.filterConfig = {
        fields: [
          {
            id: 'name',
            title:  'Name',
            placeholder: 'Filter by Name...',
            filterType: 'text'
          },
          {
            id: 'age',
            title:  'Age',
            placeholder: 'Filter by Age...',
            filterType: 'text'
          },
          {
            id: 'address',
            title:  'Address',
            placeholder: 'Filter by Address...',
            filterType: 'text'
          },
          {
            id: 'birthMonth',
            title:  'Birth Month',
            placeholder: 'Filter by Birth Month...',
            filterType: 'select',
            filterValues: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
          }
        ],
        resultsCount: $scope.items.length,
        totalCount: $scope.allItems.length,
        appliedFilters: [],
        onFilterChange: filterChange
      };

      var monthVals = {
        'January': 1,
        'February': 2,
        'March': 3,
        'April': 4,
        'May': 5,
        'June': 6,
        'July': 7,
        'August': 8,
        'September': 9,
        'October': 10,
        'November': 11,
        'December': 12
      };

      $scope.toolbarActionsConfig = {
        primaryActions: [
          {
            name: 'Action 1',
            title: 'Do the first thing',
            actionFn: performAction
          },
          {
            name: 'Action 2',
            title: 'Do something else',
            actionFn: performAction
          }
        ],
        moreActions: [
          {
            name: 'Action',
            title: 'Perform an action',
            actionFn: performAction
          },
          {
            name: 'Another Action',
            title: 'Do something else',
            actionFn: performAction
          },
          {
            name: 'Disabled Action',
            title: 'Unavailable action',
            actionFn: performAction,
            isDisabled: true
          },
          {
            name: 'Something Else',
            title: '',
            actionFn: performAction
          },
          {
            isSeparator: true
          },
          {
            name: 'Grouped Action 1',
            title: 'Do something',
            actionFn: performAction
          },
          {
            name: 'Grouped Action 2',
            actionFn: performAction,
            title: 'Do something similar'
          }
        ],
        actionsInclude: true
      };

      $scope.toolbarConfig = {
        filterConfig: $scope.filterConfig,
        sortConfig: $scope.sortConfig,
        actionsConfig: $scope.toolbarActionsConfig,
        isTableView: true
      };

      $scope.tableConfig = {
        onCheckBoxChange: handleCheckBoxChange,
        selectionMatchProp: "name",
        itemsAvailable: true
      };

      $scope.emptyStateConfig = {
        icon: 'pficon-warning-triangle-o',
        title: 'No Items Available',
        info: "This is the Empty State component. The goal of a empty state pattern is to provide a good first impression that helps users to achieve their goals. It should be used when a view is empty because no objects exists and you want to guide the user to perform specific actions.",
        helpLink: {
           label: 'For more information please see',
           urlLabel: 'pfExample',
           url : '#/api/patternfly.views.component:pfEmptyState'
        }
      };

      $scope.tableActionButtons = [
        {
          name: 'Action',
          title: 'Perform an action',
          actionFn: performTableAction
        }
      ];

      $scope.tableMenuActions = [
        {
          name: 'Action',
          title: 'Perform an action',
          actionFn: performTableAction
        },
        {
          name: 'Another Action',
          title: 'Do something else',
          actionFn: performTableAction
        },
        {
          name: 'Disabled Action',
          title: 'Unavailable action',
          actionFn: performTableAction,
          isDisabled: true
        },
        {
          name: 'Something Else',
          title: '',
          actionFn: performTableAction
        },
        {
          isSeparator: true
        },
        {
          name: 'Grouped Action 1',
          title: 'Do something',
          actionFn: performTableAction
        },
        {
          name: 'Grouped Action 2',
          title: 'Do something similar',
          actionFn: performTableAction
        }
      ];

      $scope.updateItemsAvailable = function () {
        if(!$scope.tableConfig.itemsAvailable) {
          $scope.toolbarConfig.filterConfig.resultsCount = 0;
          $scope.toolbarConfig.filterConfig.totalCount = 0;
          $scope.toolbarConfig.filterConfig.selectedCount = 0;
       } else {
          $scope.toolbarConfig.filterConfig.resultsCount = $scope.items.length;
          $scope.toolbarConfig.filterConfig.totalCount = $scope.allItems.length;
          handleCheckBoxChange();
        }
      };
    }
  ]);
  </file>
</example>
 */
;angular.module('patternfly.table').component('pfTableView', {
  bindings: {
    config: '<?',
    dtOptions: '<?',
    colummns: '<',
    items: '<',
    actionButtons: '<?',
    menuActions: '<?',
    emptyStateConfig: '=?'
  },
  templateUrl: 'table/tableview/table-view.html',
  controller: ["DTOptionsBuilder", "DTColumnDefBuilder", "$element", "pfUtils", "$log", "$filter", "$timeout", function (DTOptionsBuilder, DTColumnDefBuilder, $element, pfUtils, $log, $filter, $timeout) {
    'use strict';
    var ctrl = this, prevDtOptions, prevItems;

    // Once datatables is out of active development I'll remove log statements
    ctrl.debug = false;

    ctrl.selectAll = false;
    ctrl.dtInstance = {};

    ctrl.defaultDtOptions = {
      autoWidth: false,
      destroy: true,
      order: [[1, "asc"]],
      dom: "t",
      select: {
        selector: 'td:first-child input[type="checkbox"]',
        style: 'multi'
      }
    };

    ctrl.defaultConfig = {
      selectionMatchProp: 'uuid',
      onCheckBoxChange: null
    };

    ctrl.$onInit = function () {

      if (ctrl.debug) {
        $log.debug("$onInit");
      }

      if (angular.isUndefined(ctrl.dtOptions)) {
        ctrl.dtOptions = {};
      }
      if (angular.isUndefined(ctrl.config)) {
        ctrl.config = {};
      }

      ctrl.updateConfigOptions();

      setColumnDefs();
    };

    ctrl.updateConfigOptions = function () {
      var col, props = "";

      if (ctrl.debug) {
        $log.debug("  updateConfigOptions");
      }

      if (angular.isDefined(ctrl.dtOptions) && angular.isDefined(ctrl.dtOptions.displayLength)) {
        ctrl.dtOptions.displayLength = Number(ctrl.dtOptions.displayLength);
      }

      // Need to deep watch changes in dtOptions and items
      prevDtOptions = angular.copy(ctrl.dtOptions);
      prevItems = angular.copy(ctrl.items);

      // Setting bound variables to new variables loses it's one way binding
      //   ctrl.dtOptions = pfUtils.merge(ctrl.defaultDtOptions, ctrl.dtOptions);
      //   ctrl.config = pfUtils.merge(ctrl.defaultConfig, ctrl.config);

      // Instead, use _.defaults to update the existing variable
      _.defaults(ctrl.dtOptions, ctrl.defaultDtOptions);
      _.defaults(ctrl.config, ctrl.defaultConfig);
      // may need to use _.defaultsDeep, but not currently available in
      // lodash-amd a-pf is using

      if (!validSelectionMatchProp()) {
        angular.forEach(ctrl.colummns, function (col) {
          if (props.length === 0) {
            props = col.itemField;
          } else {
            props += ", " + col.itemField;
          }
        });
        throw new Error("pfTableView - " +
          "config.selectionMatchProp '" + ctrl.config.selectionMatchProp +
          "' does not match any property in 'config.colummns'! Please set config.selectionMatchProp " +
          "to one of these properties: " + props);
      }

      if (ctrl.items.length === 0) {
        ctrl.config.itemsAvailable = false;
      }
    };

    ctrl.dtInstanceCallback = function (_dtInstance) {
      var oTable, rows;
      if (ctrl.debug) {
        $log.debug("--> dtInstanceCallback");
      }

      ctrl.dtInstance = _dtInstance;
      listenForDraw();
      selectRowsByChecked();
    };

    ctrl.$onChanges = function (changesObj) {
      if (ctrl.debug) {
        $log.debug("$onChanges");
      }
      if ((changesObj.config && !changesObj.config.isFirstChange()) ) {
        if (ctrl.debug) {
          $log.debug("...updateConfigOptions");
        }
        ctrl.updateConfigOptions();
      }
    };

    ctrl.$doCheck = function () {
      if (ctrl.debug) {
        $log.debug("$doCheck");
      }
      // do a deep compare on dtOptions and items
      if (!angular.equals(ctrl.dtOptions, prevDtOptions)) {
        if (ctrl.debug) {
          $log.debug("  dtOptions !== prevDtOptions");
        }
        ctrl.updateConfigOptions();
      }
      if (!angular.equals(ctrl.items, prevItems)) {
        if (ctrl.debug) {
          $log.debug("  items !== prevItems");
        }
        prevItems = angular.copy(ctrl.items);
        //$timeout(function () {
        selectRowsByChecked();
        //});
      }
    };

    ctrl.$postLink = function () {
      if (ctrl.debug) {
        $log.debug(" $postLink");
      }
    };

    ctrl.$onDestroy = function () {
      if (ctrl.debug) {
        $log.debug(" $onDestroy");
      }
      ctrl.dtInstance = {};
    };

    function setColumnDefs () {
      var i = 0, actnBtns = 1;
      var item, prop;

      // add checkbox col, not sortable
      ctrl.dtColumnDefs = [ DTColumnDefBuilder.newColumnDef(i++).notSortable() ];
      // add column def. for each property of an item
      item = ctrl.items[0];
      for (prop in item) {
        if (item.hasOwnProperty(prop) && ctrl.isColItemFld(prop)) {
          ctrl.dtColumnDefs.push(DTColumnDefBuilder.newColumnDef(i++));
          // Determine selectionMatchProp column number
          if (ctrl.config.selectionMatchProp === prop) {
            ctrl.selectionMatchPropColNum = (i - 1);
          }
        }
      }
      // add actions col.
      if (ctrl.actionButtons && ctrl.actionButtons.length > 0) {
        for (actnBtns = 1; actnBtns <= ctrl.actionButtons.length; actnBtns++) {
          ctrl.dtColumnDefs.push(DTColumnDefBuilder.newColumnDef(i++).notSortable());
        }
      }
      if (ctrl.menuActions && ctrl.menuActions.length > 0) {
        ctrl.dtColumnDefs.push(DTColumnDefBuilder.newColumnDef(i++).notSortable());
      }
    }

    function listenForDraw () {
      var oTable;
      var dtInstance = ctrl.dtInstance;
      if (dtInstance && dtInstance.dataTable) {
        oTable = dtInstance.dataTable;
        ctrl.tableId = oTable[0].id;
        oTable.on('draw.dt', function () {
          if (ctrl.debug) {
            $log.debug("--> redraw");
          }
          selectRowsByChecked();
        });
      }
    }

    function validSelectionMatchProp () {
      var retVal = false, prop;
      var item = ctrl.items[0];

      if (!ctrl.items || ctrl.items.length === 0) {
        return true;    //ok to pass in empty items array
      }

      for (prop in item) {
        if (item.hasOwnProperty(prop)) {   //need this 'if' for eslint
          if (ctrl.config.selectionMatchProp === prop) {
            retVal = true;
          }
        }
      }
      return retVal;
    }
    /*
     *   Checkbox Selections
     */

    ctrl.toggleAll = function () {
      var item;
      var visibleRows = getVisibleRows();
      angular.forEach(visibleRows, function (row) {
        item = getItemFromRow(row);
        if (item.selected !== ctrl.selectAll) {
          item.selected = ctrl.selectAll;
          if (ctrl.config && ctrl.config.onCheckBoxChange) {
            ctrl.config.onCheckBoxChange(item);
          }
        }
      });
    };

    ctrl.toggleOne = function (item) {
      if (ctrl.config && ctrl.config.onCheckBoxChange) {
        ctrl.config.onCheckBoxChange(item);
      }
    };

    function getItemFromRow (matchPropValue) {
      var item, retVals;
      var filterObj = {};
      filterObj[ctrl.config.selectionMatchProp] = matchPropValue;
      retVals = $filter('filter')(ctrl.items, filterObj);

      if (retVals && retVals.length === 1) {
        item = retVals[0];
      }

      return item;
    }

    function selectRowsByChecked () {
      $timeout(function () {
        var oTable, rows, checked;

        oTable = ctrl.dtInstance.DataTable;

        if (ctrl.debug) {
          $log.debug("  selectRowsByChecked");
        }

        if (angular.isUndefined(oTable)) {
          return;
        }

        if (ctrl.debug) {
          $log.debug("  ...oTable defined");
        }

        // deselect all
        rows = oTable.rows();
        rows.deselect();

        // select those with checked checkboxes
        rows = oTable.rows( function ( idx, data, node ) {
          //         row      td     input type=checkbox
          checked = node.children[0].children[0].checked;
          return checked;
        });

        if (ctrl.debug) {
          $log.debug("   ... #checkedRows = " + rows[0].length);
        }

        if (rows[0].length > 0) {
          rows.select();
        }
        setSelectAllCheckbox();
      });
    }

    function setSelectAllCheckbox () {
      var numVisibleRows, numCheckedRows;

      if (ctrl.debug) {
        $log.debug("  setSelectAllCheckbox");
      }

      numVisibleRows = getVisibleRows().length;
      numCheckedRows = document.querySelectorAll("#" + ctrl.tableId + " tbody tr.even.selected").length +
                       document.querySelectorAll("#" + ctrl.tableId + " tbody tr.odd.selected").length;
      ctrl.selectAll = (numVisibleRows === numCheckedRows);
    }

    function getVisibleRows () {
      // Returns an array of visible 'selectionMatchProp' values
      // Ex. if selectionMatchProp === 'name' & selectionMatchPropColNum === 1 &
      //        page length === 3
      //     returns ['Mary Jane', 'Fred Flinstone', 'Frank Livingston']
      //
      var i, rowData, visibleRows = new Array();
      var oTable = ctrl.dtInstance.dataTable;

      var anNodes = document.querySelectorAll("#" + ctrl.tableId + "  tbody tr");

      for (i = 0; i < anNodes.length; ++i) {
        rowData = oTable.fnGetData(anNodes[i]);
        if (rowData !== null) {
          visibleRows.push(rowData[ctrl.selectionMatchPropColNum]);
        }
      }

      if (ctrl.debug) {
        $log.debug("    getVisibleRows (" + visibleRows.length + ")");
      }

      return visibleRows;
    }

    /*
     *   Action Buttons and Menus
     */

    ctrl.handleButtonAction = function (action, item) {
      if (action && action.actionFn) {
        action.actionFn(action, item);
      }
    };

    ctrl.isColItemFld = function (key) {
      var retVal = false;
      var tableCol = $filter('filter')(ctrl.colummns, {itemField: key});

      if (tableCol && tableCol.length === 1) {
        retVal = true;
      }

      return retVal;
    };

    ctrl.areActions = function () {
      return (ctrl.actionButtons && ctrl.actionButtons.length > 0) ||
        (ctrl.menuActions && ctrl.menuActions.length > 0);
    };

    ctrl.calcActionsColspan = function () {
      var colspan = 0;

      if (ctrl.actionButtons && ctrl.actionButtons.length > 0) {
        colspan += ctrl.actionButtons.length;
      }

      if (ctrl.menuActions && ctrl.menuActions.length > 0) {
        colspan += 1;
      }

      return colspan;
    };

    ctrl.handleMenuAction = function (action, item) {
      if (!ctrl.checkDisabled(item) && action && action.actionFn && (action.isDisabled !== true)) {
        action.actionFn(action, item);
      }
    };

    ctrl.setupActions = function (item, event) {
      /* Ignore disabled items completely
       if (ctrl.checkDisabled(item)) {
       return;
       }*/

      // update the actions based on the current item
      // $scope.updateActions(item);

      $timeout(function () {
        var parentDiv = undefined;
        var nextElement;

        nextElement = event.target;
        while (nextElement && !parentDiv) {
          if (nextElement.className.indexOf('dropdown-kebab-pf') !== -1) {
            parentDiv = nextElement;
            if (nextElement.className.indexOf('open') !== -1) {
              setDropMenuLocation (parentDiv);
            }
          }
          nextElement = nextElement.parentElement;
        }
      });
    };

    ctrl.checkDisabled = function (item) {
      return false;
    };

    function setDropMenuLocation (parentDiv) {
      var dropButton = parentDiv.querySelector('.dropdown-toggle');
      var dropMenu =  parentDiv.querySelector('.dropdown-menu');
      var parentRect = $element[0].getBoundingClientRect();
      var buttonRect = dropButton.getBoundingClientRect();
      var menuRect = dropMenu.getBoundingClientRect();
      var menuTop = buttonRect.top - menuRect.height;
      var menuBottom = buttonRect.top + buttonRect.height + menuRect.height;

      if ((menuBottom <= parentRect.top + parentRect.height) || (menuTop < parentRect.top)) {
        ctrl.dropdownClass = 'dropdown';
      } else {
        ctrl.dropdownClass = 'dropup';
      }
    }
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.toolbars.componenet:pfToolbar
 * @restrict E
 *
 * @description
 *   Standard toolbar component. Includes filtering and view selection capabilities
 *   <br><br>
 *
 * @param {object} config configuration settings for the toolbar:<br/>
 *   <ul style='list-style-type: none'>
 *     <li>.filterConfig  - (Object) Optional filter config. If undefined, no filtering capabilities are shown.
 *                          See pfSimpleFilter for filter config options.
 *     <li>.sortConfig  - (Object) Optional sort config. If undefined, no sort capabilities are shown.
 *                          See pfSort for sort config options.
 *     <li>.viewsConfig  - (Object) Optional configuration settings for view type selection
 *       <ul style='list-style-type: none'>
 *         <li>.views       - (Array) List of available views for selection. See pfViewUtils for standard available views
 *           <ul style='list-style-type: none'>
 *             <li>.id - (String) Unique id for the view, used for comparisons
 *             <li>.title - (String) Optional title, uses as a tooltip for the view selector
 *             <li>.iconClass - (String) Icon class to use for the view selector
 *           </ul>
 *         <li>.onViewSelect - ( function(view) ) Function to call when a view is selected
 *         <li>.currentView - the id of the currently selected view
 *       </ul>
 *     <li>.actionsConfig  - (Object) Optional configuration settings for toolbar actions
 *       <ul style='list-style-type: none'>
 *         <li>.primaryActions  - (Array) List of primary actions to display on the toolbar
 *           <ul style='list-style-type: none'>
 *             <li>.name - (String) The name of the action, displayed on the button
 *             <li>.title - (String) Optional title, used for the tooltip
 *             <li>.actionFn - (function(action)) Function to invoke when the action selected
 *             <li>.isDisabled - (Boolean) set to true to disable the action
 *           </ul>
 *         <li>.moreActions  - (Array) List of secondary actions to display on the toolbar action pulldown menu
 *           <ul style='list-style-type: none'>
 *             <li>.name - (String) The name of the action, displayed on the button
 *             <li>.title - (String) Optional title, used for the tooltip
 *             <li>.actionFn - (function(action)) Function to invoke when the action selected
 *             <li>.isDisabled - (Boolean) set to true to disable the action
 *             <li>.isSeparator - (Boolean) set to true if this is a placehodler for a separator rather than an action
 *           </ul>
 *         <li>.actionsInclude  - (Boolean) set to true if using the actions transclude to add custom action buttons (only available if using Angular 1.5 or later)
 *       </ul>
 *       <li>.isTableView  - (Boolean) set to true if toolbar is only being used with a table view and viewsConfig is not defined.
 *   </ul>
 *
 * @example
<example module="patternfly.toolbars.demo">
  <file name="index.html">
    <div ng-controller="ViewCtrl" class="row example-container">
      <div class="col-md-12">
        <pf-toolbar id="exampleToolbar" config="toolbarConfig">
         <actions>
           <span class="dropdown primary-action" uib-dropdown>
             <button class="btn btn-default dropdown-toggle" uib-dropdown-toggle type="button">
               Menu Action
               <span class="caret"></span>
             </button>
             <ul class="dropdown-menu">
               <li role="menuitem" ng-click="optionSelected(1)">
                 <a class="secondary-action">Option 1</a>
               </li>
               <li role="menuitem" ng-click="optionSelected(2)">
                 <a class="secondary-action">Option 2</a>
               </li>
               <li role="menuitem" ng-click="optionSelected(3)">
                 <a class="secondary-action">Option 3</a>
               </li>
               <li role="menuitem" ng-click="optionSelected(4)">
                 <a class="secondary-action">Option 4</a>
               </li>
             </ul>
           </span>
           <button class="btn btn-default primary-action" type="button" ng-click="doAdd()">
             <span class="fa fa-plus"></span>
             Add Action
           </button>
         </actions>
        </pf-toolbar>
      </div>
      <div class="col-md-12" ng-if="viewType == 'listView'">
        <pf-list-view config="listConfig"
                      items="items"
                      empty-state-config="emptyStateConfig">
          <div class="list-view-pf-description">
            <div class="list-group-item-heading">
              {{item.name}}
            </div>
            <div class="list-group-item-text">
              {{item.address}}
            </div>
          </div>
          <div class="list-view-pf-additional-info">
            <div class="list-view-pf-additional-info-item">
              {{item.age}}
            </div>
            <div class="list-view-pf-additional-info-item">
              {{item.birthMonth}}
            </div>
          </div>
        </pf-list-view>
      </div>
      <div class="col-md-12" ng-if="viewType == 'cardView'">
        <pf-card-view config="listConfig"
                      items="items"
                      empty-state-config="emptyStateConfig">
          <div class="col-md-12">
            <span>{{item.name}}</span>
          </div>
          <div class="col-md-12">
            <span>{{item.address}}</span>
          </div>
          <div class="col-md-12">
            <span>{{item.birthMonth}}</span>
          </div>
        </pf-card-view>
      </div>
      <div class="col-md-12" ng-show="viewType == 'tableView'">
        <pf-table-view config="tableConfig"
                       colummns="colummns"
                       items="items"
                       empty-state-config="emptyStateConfig">
        </pf-table-view>
      </div>
      <div class="col-md-12" style="padding-top: 12px;">
        <div class="form-group">
          <label class="checkbox-inline">
            <input type="checkbox" ng-model="listConfig.itemsAvailable" ng-change="updateItemsAvailable()">Items Available</input>
          </label>
        </div>
      </div>
      <hr class="col-md-12">
      <div class="col-md-12">
        <label class="events-label">Current Filters: </label>
      </div>
      <div class="col-md-12">
        <textarea rows="5" class="col-md-12">{{filtersText}}</textarea>
      </div>
      <div class="col-md-12">
        <label class="actions-label">Actions: </label>
      </div>
      <div class="col-md-12">
        <textarea rows="3" class="col-md-12">{{actionsText}}</textarea>
      </div>
    </div>
  </file>

  <file name="modules.js">
    angular.module('patternfly.toolbars.demo', ['patternfly.toolbars','patternfly.table']);
  </file>

  <file name="script.js">
  angular.module('patternfly.toolbars.demo').controller('ViewCtrl', ['$scope', 'pfViewUtils', '$filter',
    function ($scope, pfViewUtils, $filter) {
      $scope.filtersText = '';

      $scope.colummns = [
        { header: "Name", itemField: "name" },
        { header: "Age", itemField: "age"},
        { header: "Address", itemField: "address" },
        { header: "BirthMonth", itemField: "birthMonth"}
      ];

      // attempt to dyamically turn on/off pagination controls
      // See: issues turning on/off pagination. see: https://datatables.net/manual/tech-notes/3

      $scope.usePagination = true;
      $scope.togglePagination = function () {
        $scope.usePagination = !$scope.usePagination;
        console.log("---> togglePagination: " + $scope.usePagination);
        if($scope.usePagination) {
          $scope.dtOptions.displayLength = 3;
          $scope.dtOptions.dom = "tp";
          console.log("---> use pagination: " + $scope.dtOptions.displayLength + ":" + $scope.dtOptions.dom);
        } else {
          $scope.dtOptions.displayLength = undefined;
          $scope.dtOptions.dom = "t";
        }
      };


      $scope.allItems = [
        {
          name: "Fred Flintstone",
          age: 57,
          address: "20 Dinosaur Way, Bedrock, Washingstone",
          birthMonth: 'February'
        },
        {
          name: "John Smith",
          age: 23,
          address: "415 East Main Street, Norfolk, Virginia",
          birthMonth: 'October'
        },
        {
          name: "Frank Livingston",
          age: 71,
          address: "234 Elm Street, Pittsburgh, Pennsylvania",
          birthMonth: 'March'
        },
        {
          name: "Judy Green",
          age: 21,
          address: "2 Apple Boulevard, Cincinatti, Ohio",
          birthMonth: 'December'
        },
        {
          name: "Pat Thomas",
          age: 19,
          address: "50 Second Street, New York, New York",
          birthMonth: 'February'
        },
        {
          name: "Linda McGovern",
          age: 32,
          address: "22 Oak Stree, Denver, Colorado",
          birthMonth: 'March'
        },
        {
          name: "Jim Brown",
          age: 55,
          address: "72 Bourbon Way. Nashville. Tennessee",
          birthMonth: 'March'
        },
        {
          name: "Holly Nichols",
          age: 34,
          address: "21 Jump Street, Hollywood, California",
          birthMonth: 'March'
        }
      ];
      $scope.items = $scope.allItems;

      var matchesFilter = function (item, filter) {
        var match = true;
        var re = new RegExp(filter.value, 'i');

        if (filter.id === 'name') {
          match = item.name.match(re) !== null;
        } else if (filter.id === 'age') {
          match = item.age === parseInt(filter.value);
        } else if (filter.id === 'address') {
          match = item.address.match(re) !== null;
        } else if (filter.id === 'birthMonth') {
          match = item.birthMonth === filter.value;
        }
        return match;
      };

      var matchesFilters = function (item, filters) {
        var matches = true;

        filters.forEach(function(filter) {
          if (!matchesFilter(item, filter)) {
            matches = false;
            return false;
          }
        });
        return matches;
      };

      var applyFilters = function (filters) {
        $scope.items = [];
        if (filters && filters.length > 0) {
          $scope.allItems.forEach(function (item) {
            if (matchesFilters(item, filters)) {
              $scope.items.push(item);
            }
          });
        } else {
          $scope.items = $scope.allItems;
        }
      };

      var filterChange = function (filters) {
        $scope.filtersText = "";
        filters.forEach(function (filter) {
          $scope.filtersText += filter.title + " : " + filter.value + "\n";
        });
        applyFilters(filters);
        $scope.toolbarConfig.filterConfig.resultsCount = $scope.items.length;
      };

      $scope.filterConfig = {
        fields: [
          {
            id: 'name',
            title:  'Name',
            placeholder: 'Filter by Name...',
            filterType: 'text'
          },
          {
            id: 'age',
            title:  'Age',
            placeholder: 'Filter by Age...',
            filterType: 'text'
          },
          {
            id: 'address',
            title:  'Address',
            placeholder: 'Filter by Address...',
            filterType: 'text'
          },
          {
            id: 'birthMonth',
            title:  'Birth Month',
            placeholder: 'Filter by Birth Month...',
            filterType: 'select',
            filterValues: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
          }
        ],
        resultsCount: $scope.items.length,
        totalCount: $scope.allItems.length,
        appliedFilters: [],
        onFilterChange: filterChange
      };

      var viewSelected = function(viewId) {
        $scope.viewType = viewId;
        $scope.sortConfig.show = ($scope.viewType === "tableView" ? false : true);
      };

      $scope.viewsConfig = {
        views: [pfViewUtils.getListView(), pfViewUtils.getCardView(), pfViewUtils.getTableView()],
        onViewSelect: viewSelected
      };

      $scope.viewsConfig.currentView = $scope.viewsConfig.views[0].id;
      $scope.viewType = $scope.viewsConfig.currentView;

      var monthVals = {
        'January': 1,
        'February': 2,
        'March': 3,
        'April': 4,
        'May': 5,
        'June': 6,
        'July': 7,
        'August': 8,
        'September': 9,
        'October': 10,
        'November': 11,
        'December': 12
      };
      var compareFn = function(item1, item2) {
        var compValue = 0;
        if ($scope.sortConfig.currentField.id === 'name') {
          compValue = item1.name.localeCompare(item2.name);
        } else if ($scope.sortConfig.currentField.id === 'age') {
            compValue = item1.age - item2.age;
        } else if ($scope.sortConfig.currentField.id === 'address') {
          compValue = item1.address.localeCompare(item2.address);
        } else if ($scope.sortConfig.currentField.id === 'birthMonth') {
          compValue = monthVals[item1.birthMonth] - monthVals[item2.birthMonth];
        }

        if (!$scope.sortConfig.isAscending) {
          compValue = compValue * -1;
        }

        return compValue;
      };

      var sortChange = function (sortId, isAscending) {
        $scope.items.sort(compareFn);
      };

      $scope.sortConfig = {
        fields: [
          {
            id: 'name',
            title:  'Name',
            sortType: 'alpha'
          },
          {
            id: 'age',
            title:  'Age',
            sortType: 'numeric'
          },
          {
            id: 'address',
            title:  'Address',
            sortType: 'alpha'
          },
          {
            id: 'birthMonth',
            title:  'Birth Month',
            sortType: 'alpha'
          }
        ],
        onSortChange: sortChange
      };

      $scope.actionsText = "";
      var performAction = function (action) {
        $scope.actionsText = action.name + "\n" + $scope.actionsText;
      };

      $scope.actionsConfig = {
        primaryActions: [
          {
            name: 'Action 1',
            title: 'Do the first thing',
            actionFn: performAction
          },
          {
            name: 'Action 2',
            title: 'Do something else',
            actionFn: performAction
          }
        ],
        moreActions: [
          {
            name: 'Action',
            title: 'Perform an action',
            actionFn: performAction
          },
          {
            name: 'Another Action',
            title: 'Do something else',
            actionFn: performAction
          },
          {
            name: 'Disabled Action',
            title: 'Unavailable action',
            actionFn: performAction,
            isDisabled: true
          },
          {
            name: 'Something Else',
            title: '',
            actionFn: performAction
          },
          {
            isSeparator: true
          },
          {
            name: 'Grouped Action 1',
            title: 'Do something',
            actionFn: performAction
          },
          {
            name: 'Grouped Action 2',
            actionFn: performAction,
            title: 'Do something similar'
          }
        ],
        actionsInclude: true
      };

      $scope.toolbarConfig = {
        viewsConfig: $scope.viewsConfig,
        filterConfig: $scope.filterConfig,
        sortConfig: $scope.sortConfig,
        actionsConfig: $scope.actionsConfig
      };

      $scope.listConfig = {
        selectionMatchProp: 'name',
        checkDisabled: false,
        itemsAvailable: true,
        onCheckBoxChange: handleCheckBoxChange
      };

      $scope.emptyStateConfig = {
        icon: 'pficon-warning-triangle-o',
        title: 'No Items Available',
        info: "This is the Empty State component. The goal of a empty state pattern is to provide a good first impression that helps users to achieve their goals. It should be used when a view is empty because no objects exists and you want to guide the user to perform specific actions.",
        helpLink: {
           label: 'For more information please see',
           urlLabel: 'pfExample',
           url : '#/api/patternfly.views.component:pfEmptyState'
        }
      };

      $scope.tableConfig = {
        onCheckBoxChange: handleCheckBoxChange,
        selectionMatchProp: "name",
        itemsAvailable: true,
      };

      $scope.doAdd = function () {
        $scope.actionsText = "Add Action\n" + $scope.actionsText;
      };

      $scope.optionSelected = function (option) {
        $scope.actionsText = "Option " + option + " selected\n" + $scope.actionsText;
      };

      $scope.updateItemsAvailable = function () {
        $scope.tableConfig.itemsAvailable = $scope.listConfig.itemsAvailable;
        if(!$scope.listConfig.itemsAvailable) {
          $scope.toolbarConfig.filterConfig.resultsCount = 0;
          $scope.toolbarConfig.filterConfig.totalCount = 0;
          $scope.toolbarConfig.filterConfig.selectedCount = 0;
       } else {
          $scope.toolbarConfig.filterConfig.resultsCount = $scope.items.length;
          $scope.toolbarConfig.filterConfig.totalCount = $scope.allItems.length;
          handleCheckBoxChange();
        }
      };

      function handleCheckBoxChange (item) {
        var selectedItems = $filter('filter')($scope.allItems, {selected: true});
        if (selectedItems) {
          $scope.toolbarConfig.filterConfig.selectedCount = selectedItems.length;
        }
      }
    }
  ]);
  </file>
</example>
 */
;angular.module('patternfly.toolbars').component('pfToolbar', {
  bindings: {
    config: '='
  },
  transclude: {
    'actions': '?'
  },
  templateUrl: 'toolbars/toolbar.html',
  controller: function () {
    'use strict';

    var ctrl = this;
    var prevConfig;

    ctrl.$onInit = function () {
      if (angular.isDefined(ctrl.config.sortConfig) && angular.isUndefined(ctrl.config.sortConfig.show)) {
        // default to true
        ctrl.config.sortConfig.show = true;
      }

      angular.extend(ctrl, {
        viewSelected: viewSelected,
        isViewSelected: isViewSelected,
        isTableViewSelected: isTableViewSelected,
        checkViewDisabled: checkViewDisabled,
        addFilter: addFilter,
        handleAction: handleAction
      });
    };

    ctrl.$onChanges = function () {
      setupConfig ();
    };

    ctrl.$doCheck = function () {
      // do a deep compare on config
      if (!angular.equals(ctrl.config, prevConfig)) {
        setupConfig();
      }
    };

    function setupConfig () {
      prevConfig = angular.copy(ctrl.config);

      if (ctrl.config && ctrl.config.viewsConfig && ctrl.config.viewsConfig.views) {
        ctrl.config.viewsConfig.viewsList = angular.copy(ctrl.config.viewsConfig.views);

        if (!ctrl.config.viewsConfig.currentView) {
          ctrl.config.viewsConfig.currentView = ctrl.config.viewsConfig.viewsList[0].id;
        }
      }
    }

    function viewSelected (viewId) {
      ctrl.config.viewsConfig.currentView = viewId;
      if (ctrl.config.viewsConfig.onViewSelect && !ctrl.checkViewDisabled(viewId)) {
        ctrl.config.viewsConfig.onViewSelect(viewId);
      }
    }

    function isViewSelected (viewId) {
      return ctrl.config.viewsConfig && (ctrl.config.viewsConfig.currentView === viewId);
    }

    function isTableViewSelected () {
      return ctrl.config.viewsConfig ? (ctrl.config.viewsConfig.currentView === 'tableView') : ctrl.config.isTableView;
    }

    function checkViewDisabled (view) {
      return ctrl.config.viewsConfig.checkViewDisabled && ctrl.config.viewsConfig.checkViewDisabled(view);
    }

    function filterExists (filter) {
      var foundFilter = _.find(ctrl.config.filterConfig.appliedFilters, {title: filter.title, value: filter.value});
      return foundFilter !== undefined;
    }

    function enforceSingleSelect (filter) {
      _.remove(ctrl.config.appliedFilters, {title: filter.title});
    }

    function addFilter (field, value) {
      var newFilter = {
        id: field.id,
        title: field.title,
        value: value
      };
      if (!filterExists(newFilter)) {
        if (newFilter.type === 'select') {
          enforceSingleSelect(newFilter);
        }
        ctrl.config.filterConfig.appliedFilters.push(newFilter);

        if (ctrl.config.filterConfig.onFilterChange) {
          ctrl.config.filterConfig.onFilterChange(ctrl.config.filterConfig.appliedFilters);
        }
      }
    }

    function handleAction (action) {
      if (action && action.actionFn && (action.isDisabled !== true)) {
        action.actionFn(action);
      }
    }
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.utils:pfFixedAccordion
 * @restrict A
 * @element ANY
 * @param {string} scrollSelector specifies the selector to be used to find the element that should scroll (optional, the entire collapse area scrolls by default)
 * @param {string} groupHeight Height to set for uib-accordion group (optional)
 * @param {string} groupClass Class to set for uib-accordion group (optional)
 *
 * @description
 *   Directive for setting a ui-bootstrap uib-accordion to use a fixed height (collapse elements scroll when necessary)
 *
 * @example
 <example module="patternfly.utils" deps="ui.bootstrap">
 <file name="index.html">
 <div class="row example-container">
   <div class="col-md-4">
     <uib-accordion  pf-fixed-accordion  group-height="350px" close-others="true">
       <div uib-accordion-group is-open="false" heading="Lorem ipsum">
         Praesent sagittis est et arcu fringilla placerat. Cras erat ante, dapibus non mauris ac, volutpat sollicitudin ligula. Morbi gravida nisl vel risus tempor, sit amet luctus erat tempus. Curabitur blandit sem non pretium bibendum. Donec eleifend non turpis vitae vestibulum. Vestibulum ut sem ac nunc posuere blandit sed porta lorem. Cras rutrum velit vel leo iaculis imperdiet.
       </div>
       <div uib-accordion-group is-open="false" heading="Dolor sit amet">
         Donec consequat dignissim neque, sed suscipit quam egestas in. Fusce bibendum laoreet lectus commodo interdum. Vestibulum odio ipsum, tristique et ante vel, iaculis placerat nulla. Suspendisse iaculis urna feugiat lorem semper, ut iaculis risus tempus.
       </div>
       <div uib-accordion-group is-open="false" heading="Consectetur">
         Curabitur nisl quam, interdum a venenatis a, consequat a ligula. Nunc nec lorem in erat rhoncus lacinia at ac orci. Sed nec augue congue, vehicula justo quis, venenatis turpis. Nunc quis consectetur purus. Nam vitae viverra lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eu augue felis. Maecenas in dignissim purus, quis pulvinar lectus. Vivamus euismod ultrices diam, in mattis nibh.
       </div>
       <div uib-accordion-group is-open="false" heading="Adipisicing elit">
         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
       </div>
       <div uib-accordion-group is-open="false" heading="Suspendisse lectus tortor">
         Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
       </div>
       <div uib-accordion-group is-open="false" heading="Velit mauris">
         Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam. Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis lectus, et tristique ligula justo vitae magna.
       </div>
       <div uib-accordion-group is-open="false" heading="Aliquam convallis">
         Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem varius purus. Curabitur eu amet.
       </div>
       <div uib-accordion-group is-open="false" heading="Vulputate dictum">
         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at ante. Mauris eleifend, quam a vulputate dictum, massa quam dapibus leo, eget vulputate orci purus ut lorem. In fringilla mi in ligula. Pellentesque aliquam quam vel dolor. Nunc adipiscing. Sed quam odio, tempus ac, aliquam molestie, varius ac, tellus. Vestibulum ut nulla aliquam risus rutrum interdum. Pellentesque lorem. Curabitur sit amet erat quis risus feugiat viverra. Pellentesque augue justo, sagittis et, lacinia at, venenatis non, arcu. Nunc nec libero. In cursus dictum risus. Etiam tristique nisl a nulla. Ut a orci. Curabitur dolor nunc, egestas at, accumsan at, malesuada nec, magna.
       </div>
     </uib-accordion>
   </div>
 </div>
 </file>

 <file name="script.js">
 angular.module('patternfly.utils').controller( 'AccordionCntrl', function($scope) {
 });
 </file>
 </example>
 */
angular.module('patternfly.utils').directive('pfFixedAccordion', ["$window", "$timeout", function ($window, $timeout) {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      scrollSelector: '@',
      groupHeight: '@',
      groupClass: '@'
    },
    link: function ($scope, $element, $attrs) {
      var setBodyScrollHeight = function (parentElement, bodyHeight) {
        // Set the max-height for the fixed height components
        var collapsePanels = parentElement[0].querySelectorAll('.panel-collapse');
        var collapsePanel;
        var scrollElement;
        var panelContents;
        var nextContent;
        var innerHeight;
        var scroller;

        angular.forEach(collapsePanels, function (collapseElement) {
          collapsePanel = angular.element(collapseElement);
          scrollElement = collapsePanel;
          innerHeight = 0;

          if (angular.isDefined($scope.scrollSelector)) {
            scroller = angular.element(collapsePanel[0].querySelector($scope.scrollSelector));
            if (scroller.length === 1) {
              scrollElement = angular.element(scroller[0]);
              panelContents = collapsePanel.children();
              angular.forEach(panelContents, function (contentElement) {
                nextContent = angular.element(contentElement);

                // Get the height of all the non-scroll element contents
                if (nextContent[0] !== scrollElement[0]) {
                  innerHeight += nextContent[0].offsetHeight;
                  innerHeight += parseInt(getComputedStyle(nextContent[0]).marginTop);
                  innerHeight += parseInt(getComputedStyle(nextContent[0]).marginBottom);
                }
              });
            }
          }

          // set the max-height
          angular.element(scrollElement).css('max-height', (bodyHeight - innerHeight) + 'px');
          angular.element(scrollElement).css('overflow-y', 'auto');
        });
      };

      var setCollapseHeights = function () {
        var height, openPanel, contentHeight, bodyHeight, overflowY = 'hidden';
        var parentElement = angular.element($element[0].querySelector('.panel-group'));
        var headings = angular.element(parentElement).children();
        var headingElement;

        height = parentElement[0].clientHeight;

        // Close any open panel
        openPanel = parentElement[0].querySelectorAll('.collapse.in');
        if (openPanel && openPanel.length > 0) {
          angular.element(openPanel).removeClass('in');
        }

        // Determine the necessary height for the closed content
        contentHeight = 0;

        angular.forEach(headings, function (heading) {
          headingElement = angular.element(heading);
          contentHeight += headingElement.prop('offsetHeight');
          contentHeight += parseInt(getComputedStyle(headingElement[0]).marginTop);
          contentHeight += parseInt(getComputedStyle(headingElement[0]).marginBottom);
        });

        // Determine the height remaining for opened collapse panels
        bodyHeight = height - contentHeight;

        // Make sure we have enough height to be able to scroll the contents if necessary
        if (bodyHeight < 25) {
          bodyHeight = 25;

          // Allow the parent to scroll so the child elements are accessible
          overflowY = 'auto';
        }

        // Reopen the initially opened panel
        if (openPanel && openPanel.length > 0) {
          angular.element(openPanel).addClass("in");
        }

        angular.element(parentElement).css('overflow-y', overflowY);

        // Update body scroll element's height after allowing these changes to set in
        $timeout(function () {
          setBodyScrollHeight (parentElement, bodyHeight);
        });
      };

      if ($scope.groupHeight) {
        angular.element($element[0].querySelector('.panel-group')).css('height', $scope.groupHeight);
      }
      if ($scope.groupClass) {
        angular.element($element[0].querySelector(".panel-group")).addClass($scope.groupClass);
      }

      $timeout(function () {
        setCollapseHeights();
      }, 100);

      // Update on window resizing
      $element.on('resize', function () {
        setCollapseHeights();
      });
      angular.element($window).on('resize', function () {
        setCollapseHeights();
      });
    }
  };
}]);
;
/**
 * @ngdoc directive
 * @name patternfly.utils.directive:pfTransclude
 * @restrict A
 * @element ANY
 * @param {string} pfTransclude specifies the type of transclusion to use.<br/>
 * <strong>Values:</strong>
 * <ul style='list-style-type: none'>
 * <li> 'sibling' - The transcluded contents scope is a sibling one to the element where transclusion happens (default)
 * <li> 'parent'  - The transcluded contents scope is that of the element where transclusion happens.
 * <li> 'child'   - The transcluded contents scope is child scope to the scope of the element where transclusion happens.
 * </ul>
 *
 * @description
 *   Directive for transcluding in directives and setting up scope of children of parent directives. This is a workaround
 *   for https://github.com/angular/angular.js/issues/5489
 *
 * @example
<example module="patternfly.utils">
  <file name="index.html">
    <div ng-controller="UtilCtrl" class="row pf-transclude-example" style="display:inline-block; width: 100%;">
      <span>Here the scope id is: <id>{{$id}}</id></span>

      <transclude-sibling class="pf-transclude-example">
        <pre>This content was transcluded using <b>pf-transclude</b> or <b>pf-transclude="sibling"</b>.</pre><pre>Its scope is: <id>{{$id}}</id> the parent of which is <id>{{$parent.$id}}</id></pre>
      </transclude-sibling>

      <transclude-parent>
        <pre>This content was transcluded using <b>pf-transclude="parent"</b>.</pre><pre>Its scope is: <id>{{$id}}</id> the parent of which is <id>{{$parent.$id}}</id></pre>
      </transclude-parent>

      <transclude-child>
        <pre>This content was transcluded using <b>pf-transclude="child"</b>.</pre><pre>Its scope is: <id>{{$id}}</id> the parent of which is <id>{{$parent.$id}}</id></pre>
      </transclude-child>
    </div>
  </file>

  <file name="script.js">
    angular.module('patternfly.utils')
      .controller( 'UtilCtrl', function($scope) {

      })

      .config(function($provide){
          $provide.decorator('ngTranscludeDirective', ['$delegate', function($delegate) {
              // Remove the original directive
              $delegate.shift();
              return $delegate;
          }]);
      })

      .directive( 'transcludeSibling', function() {
        return {
          restrict: 'E',
          transclude: true,
          scope: {},
          template:
            '<div>' +
              '<p>I am a directive with scope <id>{{$id}}</id></p>' +
              '<span pf-transclude></span>' +
            '</div>'
        }
      })

      .directive( 'transcludeParent', function() {
        return {
          restrict: 'E',
          transclude: true,
          scope: {},
          template:
            '<div>' +
              '<p>I am a directive with scope <id>{{$id}}</id></p>' +
              '<span pf-transclude="parent"></span>' +
            '</div>'
        }
      })

      .directive( 'transcludeChild', function() {
        return {
          restrict: 'E',
          transclude: true,
          scope: {},
          template:
            '<div>' +
              '<p>I am a directive with scope <id>{{$id}}</id></p>' +
              '<span pf-transclude="child"></span>' +
            '</div>'
        }
      })
    ;
  </file>
</example>
 */
angular
  .module('patternfly.utils').directive('pfTransclude', function () {
    'use strict';
    return {
      restrict: 'A',
      link: function ($scope, $element, $attrs, controller, $transclude) {
        var iChildScope;
        var iScopeType;

        if (!$transclude) {
          throw new Error('pfTransclude - ' +
          'Illegal use of pfTransclude directive in the template! ' +
          'No parent directive that requires a transclusion found. ' +
          'Element: {0}');
        }

        iScopeType = $attrs.pfTransclude || 'sibling';

        switch (iScopeType) {
        case 'sibling':
          $transclude(function (clone) {
            $element.empty();
            $element.append(clone);
          });
          break;
        case 'parent':
          $transclude($scope, function (clone) {
            $element.empty();
            $element.append( clone );
          });
          break;
        case 'child':
          iChildScope = $scope.$new();
          $transclude( iChildScope, function (clone) {
            $element.empty();
            $element.append( clone );
            $element.on( '$destroy', function () {
              iChildScope.$destroy();
            });
          });
          break;
        }
      }
    };
  });
;(function () {
  'use strict';

  angular.module('patternfly.utils').constant('pfUtils', {
    merge: function (source1, source2) {
      var retValue;

      if (typeof angular.merge === 'function') {
        retValue = this.angularMerge(source1, source2);
      } else if (typeof _.merge === 'function') {
        retValue = this._merge(source1, source2);
      } else if (typeof $.extend === 'function') {
        retValue = this.$extend(source1, source2);
      } else {
        retValue = this.mergeDeep(source1, source2);
      }

      return retValue;
    },
    angularMerge: function (source1, source2) {
      return angular.merge({}, source1, source2);
    },
    _merge: function (source1, source2) {
      return _.merge({}, source1, source2);
    },
    $extend: function (source1, source2) {
      return $.extend(true, angular.copy(source1), source2);
    },
    mergeDeep: function (source1, source2) {
      return mergeDeep({}, angular.copy(source1), angular.copy(source2));
    },

    colorPalette: patternfly.pfPaletteColors
  });
})();

/* This function does not merge/concat Arrays.
 * It replaces the earlier Array with any latter Array.
 */
function mergeDeep (dst) {
  'use strict';
  angular.forEach(arguments, function (obj) {
    if (obj !== dst) {
      angular.forEach(obj, function (value, key) {
        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
          mergeDeep(dst[key], value);
        } else {
          dst[key] = value;
        }
      });
    }
  });
  return dst;
}
;/**
 * @ngdoc directive
 * @name patternfly.validation:pfValidation
 * @restrict E
 * @element INPUT
 * @scope
 *
 * @description
 * Directive used for input validation based on custom function.
 *
 * @param {expression=} pfValidationDisabled If true, the validation is disabled, it is enabled otherwise.
 *
 * @example
 <example module="patternfly.validation">

   <file name="index.html">
     <div ng-controller="ValidationDemoCtrl">
     <form class="form-horizontal">

       <div class="form-group">
         <label class="col-sm-2 control-label" for="message">Initially valid:</label>
         <div class="col-sm-10">
           <input class="form-control" type="text" ng-model="myValueValid" pf-validation="isNumber(input)"/>
           <span class="help-block">The value you typed is not a number.</span>
         </div>
       </div>

       <div class="form-group">
         <label class="col-sm-2 control-label" for="message">Fixed Number:</label>
         <div class="col-sm-10">
           <input class="form-control" type="text" ng-model="myValue" pf-validation="isNumber(input)"/>
           <span class="help-block">The value you typed is not a number.</span>
         </div>
       </div>

       <div class="form-group">
         <label class="col-sm-2 control-label" for="message">Number:</label>
         <div class="col-sm-10">
           <input class="form-control" type="text" ng-model="myValue" pf-validation="isNumber(input)" pf-validation-disabled="isValidationDisabled"/>
           <span class="help-block">The value you typed is not a number.</span>
         </div>
       </div>

       <div class="form-group">
         <label class="col-sm-2 control-label" for="message">Validation disabled:</label>
         <div class="col-sm-10">
           <input class="form-control" type="checkbox" ng-model="isValidationDisabled"/>
         </div>
       </div>
     </form>
     </div>
   </file>

   <file name="script.js">
     angular.module( 'patternfly.validation' ).controller( 'ValidationDemoCtrl', function( $scope ) {
       $scope.myValue = "Change this value to be a number";
       $scope.myValueValid = 42;
       $scope.isValidationDisabled = false;

       $scope.isNumber = function (value) {
         if (isNaN(value)) {
           return false;
         }

         return true;
       }
     });
   </file>

 </example>
 */
angular.module('patternfly.validation', []).directive('pfValidation', ["$timeout", function ($timeout) {
  'use strict';

  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      pfValidation: '&',
      pfValidationDisabled: '='
    },
    link: function (scope, element, attrs, ctrl) {

      scope.inputCtrl = ctrl;
      scope.valEnabled = !attrs.pfValidationDisabled;

      scope.$watch('pfValidationDisabled', function (newVal) {
        scope.valEnabled = !newVal;
        if (newVal) {
          scope.inputCtrl.$setValidity('pfValidation', true);
          toggleErrorClass(false);
        } else {
          validate();
        }
      });

      // If validation function is set
      if (attrs.pfValidation) {
        // using $timeout(0) to get the actual $modelValue
        $timeout(function () {
          validate();
        }, 0);
      } else if (!scope.inputCtrl.$valid && scope.inputCtrl.$dirty) {
        toggleErrorClass(true);
      }

      scope.$watch('inputCtrl.$valid', function (isValid) {
        if (isValid) {
          toggleErrorClass(false);
        } else {
          toggleErrorClass(true);
        }
      });

      scope.$watch('inputCtrl.$modelValue', function () {
        validate();
      });

      function validate () {
        var valid;

        var val = scope.inputCtrl.$modelValue;

        var valFunc = scope.pfValidation({'input': val});

        if (!attrs.pfValidation) {
          valFunc = true;
        }

        valid = !val || valFunc  || val === '';

        if (scope.valEnabled && !valid) {
          toggleErrorClass(true);
        } else {
          toggleErrorClass(false);
        }
      }

      function toggleErrorClass (add) {
        var messageElement = element.next();
        var parentElement = element.parent();
        var hasErrorM = parentElement.hasClass('has-error');
        var wasHidden = messageElement.hasClass('ng-hide');

        scope.inputCtrl.$setValidity('pf-validation', !add);

        if (add) {
          if (!hasErrorM) {
            parentElement.addClass('has-error');
          }
          if (wasHidden) {
            messageElement.removeClass('ng-hide');
          }
        }

        if (!add) {
          if (hasErrorM) {
            parentElement.removeClass('has-error');
          }
          if (!wasHidden) {
            messageElement.addClass('ng-hide');
          }
        }
      }
    }
  };
}]);
;/**
 * @ngdoc directive
 * @name patternfly.views.component:pfCardView
 * @restrict E
 *
 * @description
 *   Component for rendering cards in a view
 *   <br><br>
 *
 * @param {object} config configuration settings for the cards:<br/>
 * <ul style='list-style-type: none'>
 * <li>.showSelectBox          - (boolean) Show item selection boxes for each item, default is true
 * <li>.selectItems            - (boolean) Allow card selection, default is false
 * <li>.dlbClick               - (boolean) Handle double clicking (item remains selected on a double click). Default is false.
 * <li>.multiSelect            - (boolean) Allow multiple card selections, selectItems must also be set, not applicable when dblClick is true. Default is false
 * <li>.selectionMatchProp     - (string) Property of the items to use for determining matching, default is 'uuid'
 * <li>.selectedItems          - (array) Current set of selected items
 * <li>.checkDisabled          - ( function(item) ) Function to call to determine if an item is disabled, default is none
 * <li>.onCheckBoxChange       - ( function(item) ) Called to notify when a checkbox selection changes, default is none
 * <li>.onSelect               - ( function(item, event) ) Called to notify of item selection, default is none
 * <li>.onSelectionChange      - ( function(items) ) Called to notify when item selections change, default is none
 * <li>.onClick                - ( function(item, event) ) Called to notify when an item is clicked, default is none
 * <li>.onDblClick             - ( function(item, event) ) Called to notify when an item is double clicked, default is none
 * <li>.itemsAvailable         - (boolean) If 'false', displays the {@link patternfly.views.component:pfEmptyState Empty State} component.
 * </ul>
 * @param {object} emptyStateConfig Optional configuration settings for the empty state component.  See the {@link patternfly.views.component:pfEmptyState Empty State} component
 * @param {Array} items the data to be shown in the cards<br/>
 *
 * @example
 <example module="patternfly.views" deps="patternfly.utils">
 <file name="index.html">
   <style>
     hr {
      display: block;
      height: 10px;
      border: 0;
      border-top: 1px solid #525252;
      margin: 1em 0;
      padding: 0;
     }
   </style>
   <div ng-controller="ViewCtrl" class="row" style="display:inline-block; width: 100%;">
     <div class="col-md-12">
       <pf-card-view id="exampleCardView" config="config" empty-state-config="emptyStateConfig" items="items">
         <div class="col-md-12">
           <span>{{item.name}}</span>
         </div>
         <div class="col-md-12">
           <span>{{item.address}}</span>
         </div>
         <div class="col-md-12">
           <span>{{item.city}}, {{item.state}}</span>
         </div>
       </pf-card-view>
     </div>
     <hr class="col-md-12">
     <div class="col-md-12">
       <form role="form">
         <div class="form-group">
           <label>Selection</label>
           </br>
           <label class="radio-inline">
             <input type="radio" ng-model="selectType" value="checkbox" ng-change="updateSelectionType()">Checkbox</input>
           </label>
           <label class="radio-inline">
             <input type="radio" ng-model="selectType" value="card" ng-change="updateSelectionType()">Card</input>
           </label>
           <label class="radio-inline">
             <input type="radio" ng-model="selectType" value="none" ng-change="updateSelectionType()">None</input>
           </label>
         </div>
       </form>
     </div>
     <div class="col-md-12">
       <form role="form">
         <div class="form-group">
           <label class="checkbox-inline">
             <input type="checkbox" ng-model="config.dblClick" ng-disabled="!config.selectItems">Double Click</input>
           </label>
           <label class="checkbox-inline">
             <input type="checkbox" ng-model="config.multiSelect" ng-disabled="config.dblClick || !config.selectItems">Multi Select</input>
           </label>
         </div>
       </form>
     </div>
     <div class="col-md-12">
       <form role="form">
         <div class="form-group">
           <label class="checkbox-inline">
             <input type="checkbox" ng-model="showDisabled">Show Disabled Cards</input>
           </label>
           <label class="checkbox-inline">
             <input type="checkbox" ng-model="config.itemsAvailable">Items Available</input>
           </label>
         </div>
       </form>
     </div>
     <div class="col-md-12">
       <label class="events-label">Events: </label>
     </div>
     <div class="col-md-12">
       <textarea rows="10" class="col-md-12">{{eventText}}</textarea>
     </div>
   </div>
 </file>

 <file name="script.js">
 angular.module('patternfly.views').controller('ViewCtrl', ['$scope',
 function ($scope) {
        $scope.eventText = '';
        var handleSelect = function (item, e) {
          $scope.eventText = item.name + ' selected\n' + $scope.eventText;
        };
        var handleSelectionChange = function (selectedItems, e) {
          $scope.eventText = selectedItems.length + ' items selected\n' + $scope.eventText;
        };
        var handleClick = function (item, e) {
          $scope.eventText = item.name + ' clicked\n' + $scope.eventText;
        };
        var handleDblClick = function (item, e) {
          $scope.eventText = item.name + ' double clicked\n' + $scope.eventText;
        };
        var handleCheckBoxChange = function (item, selected, e) {
          $scope.eventText = item.name + ' checked: ' + item.selected + '\n' + $scope.eventText;
        };

        var checkDisabledItem = function(item) {
          return $scope.showDisabled && (item.name === "John Smith");
        };

        $scope.selectType = 'checkbox';
        $scope.updateSelectionType = function() {
          if ($scope.selectType === 'checkbox') {
            $scope.config.selectItems = false;
            $scope.config.showSelectBox = true;
          } else if ($scope.selectType === 'card') {
            $scope.config.selectItems = true;
            $scope.config.showSelectBox = false;
          } else {
            $scope.config.selectItems = false
            $scope.config.showSelectBox = false;
          }
        };

        $scope.showDisabled = false;

        $scope.config = {
         selectItems: false,
         itemsAvailable: true,
         multiSelect: false,
         dblClick: false,
         selectionMatchProp: 'name',
         selectedItems: [],
         checkDisabled: checkDisabledItem,
         showSelectBox: true,
         onSelect: handleSelect,
         onSelectionChange: handleSelectionChange,
         onCheckBoxChange: handleCheckBoxChange,
         onClick: handleClick,
         onDblClick: handleDblClick
        };

        $scope.items = [
          {
            name: "Fred Flintstone",
            address: "20 Dinosaur Way",
            city: "Bedrock",
            state: "Washingstone"
          },
          {
            name: "John Smith",
            address: "415 East Main Street",
            city: "Norfolk",
            state: "Virginia"
          },
          {
            name: "Frank Livingston",
            address: "234 Elm Street",
            city: "Pittsburgh",
            state: "Pennsylvania"
          },
          {
            name: "Judy Green",
            address: "2 Apple Boulevard",
            city: "Cincinatti",
            state: "Ohio"
          },
          {
            name: "Pat Thomas",
            address: "50 Second Street",
            city: "New York",
            state: "New York"
          },
        ]

        $scope.emptyStateConfig = {
          icon: 'pficon-warning-triangle-o',
          title: 'No Items Available',
          info: "This is the Empty State component. The goal of a empty state pattern is to provide a good first impression that helps users to achieve their goals. It should be used when a view is empty because no objects exists and you want to guide the user to perform specific actions.",
          helpLink: {
             label: 'For more information please see',
             urlLabel: 'pfExample',
             url : '#/api/patternfly.views.component:pfEmptyState'
          }
        };
      }
 ]);
 </file>
 </example>
 */
angular.module('patternfly.views').component('pfCardView', {
  bindings: {
    config: '=?',
    emptyStateConfig: '=?',
    items: '=',
    eventId: '@id'
  },
  transclude: true,
  templateUrl: 'views/cardview/card-view.html',
  controller: function () {
    'use strict';
    var ctrl = this;
    ctrl.defaultConfig = {
      selectItems: false,
      multiSelect: false,
      dblClick: false,
      selectionMatchProp: 'uuid',
      selectedItems: [],
      checkDisabled: false,
      showSelectBox: true,
      onSelect: null,
      onSelectionChange: null,
      onCheckBoxChange: null,
      onClick: null,
      onDblClick: null
    };

    ctrl.itemClick = function (e, item) {
      var alreadySelected;
      var selectionChanged = false;
      var continueEvent = true;

      // Ignore disabled item clicks completely
      if (ctrl.checkDisabled(item)) {
        return continueEvent;
      }

      if (ctrl.config && ctrl.config.selectItems && item) {
        if (ctrl.config.multiSelect && !ctrl.config.dblClick) {

          alreadySelected = _.find(ctrl.config.selectedItems, function (itemObj) {
            return itemObj === item;
          });

          if (alreadySelected) {
            // already selected so deselect
            ctrl.config.selectedItems = _.without(ctrl.config.selectedItems, item);
          } else {
            // add the item to the selected items
            ctrl.config.selectedItems.push(item);
            selectionChanged = true;
          }
        } else {
          if (ctrl.config.selectedItems[0] === item) {
            if (!ctrl.config.dblClick) {
              ctrl.config.selectedItems = [];
              selectionChanged = true;
            }
            continueEvent = false;
          } else {
            ctrl.config.selectedItems = [item];
            selectionChanged = true;
          }
        }

        if (selectionChanged && ctrl.config.onSelect) {
          ctrl.config.onSelect(item, e);
        }
        if (selectionChanged && ctrl.config.onSelectionChange) {
          ctrl.config.onSelectionChange(ctrl.config.selectedItems, e);
        }
      }
      if (ctrl.config.onClick) {
        ctrl.config.onClick(item, e);
      }

      return continueEvent;
    };

    ctrl.dblClick = function (e, item) {
      if (ctrl.config.onDblClick) {
        ctrl.config.onDblClick(item, e);
      }
    };

    ctrl.checkBoxChange = function (item) {
      if (ctrl.config.onCheckBoxChange) {
        ctrl.config.onCheckBoxChange(item);
      }
    };

    ctrl.isSelected = function (item) {
      var matchProp = ctrl.config.selectionMatchProp;
      var selected = false;

      if (ctrl.config.showSelectBox) {
        selected = item.selected;
      } else {
        if (ctrl.config.selectedItems.length) {
          return _.find(ctrl.config.selectedItems, function (itemObj) {
            return itemObj[matchProp] === item[matchProp];
          });
        }
      }
      return selected;
    };

    ctrl.checkDisabled = function (item) {
      return ctrl.config.checkDisabled && ctrl.config.checkDisabled(item);
    };

    ctrl.$onInit = function () {
      // Setting bound variables to new variables loses it's binding
      //   ctrl.config = pfUtils.merge(ctrl.defaultConfig, ctrl.config);
      // Instead, use _.defaults to update the existing variable
      _.defaults(ctrl.config, ctrl.defaultConfig);
      if (ctrl.config.selectItems && ctrl.config.showSelectBox) {
        throw new Error('pfCardView - ' +
          'Illegal use of pfCardView component! ' +
          'Cannot allow both select box and click selection in the same card view.');
      }
    };
  }
});
;/**
 * @ngdoc directive
 * @name patternfly.views.component:pfEmptyState
 * @restrict E
 *
 * @description
 * Component for rendering an empty state.
 *
 * @param {object} config Optional configuration object
 * <ul style='list-style-type: none'>
 *   <li>.icon   - (string) class for main icon. Ex. 'pficon pficon-add-circle-o'
 *   <li>.title  - (string) Text for the main title
 *   <li>.info  - (string) Text for the main informational paragraph
 * </ul>
 * @param {array} actionButtons Buttons to display under the icon, title, and informational paragraph.
 *   <ul style='list-style-type: none'>
 *     <li>.name - (String) The name of the action, displayed on the button
 *     <li>.title - (String) Optional title, used for the tooltip
 *     <li>.actionFn - (function(action)) Function to invoke when the action selected
 *     <li>.type - (String) Optional type property. Set to 'main' to be displayed as a main action button.
 *     If unspecified, action button will be displayed as a secondary action button.
 *   </ul>
 * @example
 <example module="patternfly.views" deps="patternfly.utils">
 <file name="index.html">
   <div ng-controller="ViewCtrl" class="row example-container">
     <div class="col-md-12">
       <pf-empty-state config="config" action-buttons="actionButtons"></pf-empty-state>
     </div>
     <hr class="col-md-12">
     <div class="col-md-12">
       <label style="font-weight:normal;vertical-align:center;">Events: </label>
     </div>
     <div class="col-md-12">
       <textarea rows="10" class="col-md-12">{{eventText}}</textarea>
     </div>
   </div>
 </file>

 <file name="script.js">
 angular.module('patternfly.views').controller('ViewCtrl', ['$scope',
   function ($scope) {
     $scope.eventText = '';

     $scope.config = {
       icon: 'pficon-add-circle-o',
       title: 'Empty State Title',
       info: "This is the Empty State component. The goal of a empty state pattern is to provide a good first impression that helps users to achieve their goals. It should be used when a view is empty because no objects exists and you want to guide the user to perform specific actions.",
       helpLink: {
           label: 'For more information please see',
           urlLabel: 'pfExample',
           url : '#/api/patternfly.views.component:pfEmptyState'
       }
     };

     var performAction = function (action) {
       $scope.eventText = action.name + " executed. \r\n" + $scope.eventText;
     };

     $scope.actionButtons = [
        {
          name: 'Main Action',
          title: 'Perform an action',
          actionFn: performAction,
          type: 'main'
        },
        {
          name: 'Secondary Action 1',
          title: 'Perform an action',
          actionFn: performAction
        },
        {
          name: 'Secondary Action 2',
          title: 'Perform an action',
          actionFn: performAction
        },
        {
          name: 'Secondary Action 3',
          title: 'Perform an action',
          actionFn: performAction
        }
     ];
   }
 ]);
</file>
</example>
*/
angular.module('patternfly.views').component('pfEmptyState', {
  bindings: {
    config: '<?',
    actionButtons: "<?"
  },
  templateUrl: 'views/empty-state.html',
  controller: ["$filter", function ($filter) {
    'use strict';
    var ctrl = this;

    ctrl.defaultConfig = {
      title: 'No Items Available'
    };

    ctrl.$onInit = function () {
      if (angular.isUndefined(ctrl.config)) {
        ctrl.config = {};
      }
      ctrl.updateConfig();
    };

    ctrl.updateConfig = function () {
      _.defaults(ctrl.config, ctrl.defaultConfig);
    };

    ctrl.$onChanges = function (changesObj) {
      if ((changesObj.config && !changesObj.config.isFirstChange()) ) {
        ctrl.updateConfig();
      }
    };

    ctrl.hasMainActions = function () {
      var mainActions;

      if (ctrl.actionButtons) {
        mainActions = $filter('filter')(ctrl.actionButtons, {type: 'main'});
        return mainActions.length;
      }

      return false;
    };

    ctrl.hasSecondaryActions = function () {
      var secondaryActions;

      if (ctrl.actionButtons) {
        secondaryActions = $filter('filter')(ctrl.actionButtons, {type: undefined});
        return secondaryActions.length;
      }

      return false;
    };

    ctrl.filterMainActions = function (action) {
      return action.type === 'main';
    };

    ctrl.filterSecondaryActions = function (action) {
      return action.type !== 'main';
    };

    ctrl.handleButtonAction = function (action) {
      if (action && action.actionFn) {
        action.actionFn(action);
      }
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.views.component:pfListView
 * @restrict E
 *
 * @description
 *   Component for rendering a list view.
 *   Pass a customScope object containing any scope variables/functions you need to access from the transcluded source, access these
 *   via '$ctrl.customScope' in your transcluded hmtl.
 *   <br><br>
 *   If using expanding rows, use a list-expanded-content element containing expandable content for each row.  Item data can be accessed inside list-expanded-content by using $parent.item.property.  For each item in the items array, the expansion can be disabled by setting disableRowExpansion to true on the item.
 *
 * @param {array} items Array of items to display in the list view. If an item in the array has a 'rowClass' field, the value of this field will be used as a class specified on the row (list-group-item).
 * @param {object} config Configuration settings for the list view:
 * <ul style='list-style-type: none'>
 * <li>.showSelectBox          - (boolean) Show item selection boxes for each item, default is true
 * <li>.selectItems            - (boolean) Allow row selection, default is false
 * <li>.dlbClick               - (boolean) Handle double clicking (item remains selected on a double click). Default is false.
 * <li>.dragEnabled            - (boolean) Enable drag and drop. Default is false.
 * <li>.dragEnd                - ( function() ) Function to call when the drag operation ended, default is none
 * <li>.dragMoved              - ( function() ) Function to call when the drag operation moved an element, default is none
 * <li>.dragStart              - ( function(item) ) Function to call when the drag operation started, default is none
 * <li>.multiSelect            - (boolean) Allow multiple row selections, selectItems must also be set, not applicable when dblClick is true. Default is false
 * <li>.useExpandingRows       - (boolean) Allow row expansion for each list item.
 * <li>.selectionMatchProp     - (string) Property of the items to use for determining matching, default is 'uuid'
 * <li>.selectedItems          - (array) Current set of selected items
 * <li>.itemsAvailable         - (boolean) If 'false', displays the {@link patternfly.views.component:pfEmptyState Empty State} component.
 * <li>.checkDisabled          - ( function(item) ) Function to call to determine if an item is disabled, default is none
 * <li>.onCheckBoxChange       - ( function(item) ) Called to notify when a checkbox selection changes, default is none
 * <li>.onSelect               - ( function(item, event) ) Called to notify of item selection, default is none
 * <li>.onSelectionChange      - ( function(items) ) Called to notify when item selections change, default is none
 * <li>.onClick                - ( function(item, event) ) Called to notify when an item is clicked, default is none. Note: row expansion is the default behavior after onClick performed, but user can stop such default behavior by adding the sentence "return false;" to the end of onClick function body
 * <li>.onDblClick             - ( function(item, event) ) Called to notify when an item is double clicked, default is none
 * </ul>
 * @param {array} actionButtons List of action buttons in each row
 *   <ul style='list-style-type: none'>
 *     <li>.name - (String) The name of the action, displayed on the button
 *     <li>.title - (String) Optional title, used for the tooltip
 *     <li>.class - (String) Optional class to add to the action button
 *     <li>.include - (String) Optional include src for the button. Used for custom button layouts (icons, dropdowns, etc)
 *     <li>.includeClass - (String) Optional class to set on the include src div (only relevant when include is set).
 *     <li>.actionFn - (function(action)) Function to invoke when the action selected
 *   </ul>
 * @param {function (action, item))} enableButtonForItemFn function(action, item) Used to enabled/disable an action button based on the current item
 * @param {array} menuActions List of actions for dropdown menu in each row
 *   <ul style='list-style-type: none'>
 *     <li>.name - (String) The name of the action, displayed on the button
 *     <li>.title - (String) Optional title, used for the tooltip
 *     <li>.actionFn - (function(action)) Function to invoke when the action selected
 *     <li>.isVisible - (Boolean) set to false to hide the action
 *     <li>.isDisabled - (Boolean) set to true to disable the action
 *     <li>.isSeparator - (Boolean) set to true if this is a placeholder for a separator rather than an action
 *   </ul>
 * @param {function (item))} hideMenuForItemFn function(item) Used to hide all menu actions for a particular item
 * @param {function (item))} menuClassForItemFn function(item) Used to specify a class for an item's dropdown kebab
 * @param {function (action, item))} updateMenuActionForItemFn function(action, item) Used to update a menu action based on the current item
 * @param {object} customScope Object containing any variables/functions used by the transcluded html, access via $ctrl.customScope.<xxx>
 * @param {object} emptyStateConfig Optional configuration settings for the empty state component.  See the {@link patternfly.views.component:pfEmptyState Empty State} component
 * @example
<example module="patternfly.views" deps="patternfly.utils">
  <file name="index.html">
    <div ng-controller="ViewCtrl" class="row example-container">
      <div class="col-md-12 list-view-container example-list-view">
        <pf-list-view id="exampleListView"
                          config="config"
                          empty-state-config="emptyStateConfig"
                          items="items"
                          action-buttons="actionButtons"
                          enable-button-for-item-fn="enableButtonForItemFn"
                          menu-actions="menuActions"
                          update-menu-action-for-item-fn="updateMenuActionForItemFn"
                          menu-class-for-item-fn="getMenuClass"
                          hide-menu-for-item-fn="hideMenuActions">
          <div class="list-view-pf-description">
            <div class="list-group-item-heading">
              {{item.name}}
            </div>
            <div class="list-group-item-text">
              {{item.address}}
            </div>
          </div>
          <div class="list-view-pf-additional-info">
            <div class="list-view-pf-additional-info-item">
              {{item.city}}
            </div>
            <div class="list-view-pf-additional-info-item">
              {{item.state}}
            </div>
          </div>
          <list-expanded-content>
           <div class="row">
            <div class="col-md-3">
              <div pf-donut-pct-chart config="exampleChartConfig" data="{'used': '350','total': '1000'}" center-label="'Percent Used'"></div>
            </div>
            <div class="col-md-9">
               <dl class="dl-horizontal">
                 <dt>Host</dt>
                 <dd>{{$parent.item.city}}</dd>
                 <dt>Admin</dt>
                 <dd>{{$parent.item.name}}</dd>
                 <dt>Time</dt>
                 <dd>January 15, 2016 10:45:11 AM</dd>
                 <dt>Severity</dt>
                 <dd>Warning</dd>
                 <dt>Cluster</dt>
                 <dd>Cluster 1</dd>
               </dl>
               <p>
                 Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                 tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                 quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                 consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                 cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                 proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
               </p>
             </div>
           </div>
          </list-expanded-content>
        </pf-list-view>
      </div>
      <hr class="col-md-12">
      <div class="col-md-12">
        <form role="form">
          <div class="form-group">
            <label>Selection</label>
            </br>
            <label class="radio-inline">
              <input type="radio" ng-model="selectType" value="checkbox" ng-change="updateSelectionType()">Checkbox</input>
            </label>
            <label class="radio-inline">
              <input type="radio" ng-model="selectType" value="row" ng-change="updateSelectionType()">Row</input>
            </label>
            <label class="radio-inline">
              <input type="radio" ng-model="selectType" value="none" ng-change="updateSelectionType()">None</input>
            </label>
          </div>
        </form>
      </div>
      <div class="col-md-12">
        <form role="form">
          <div class="form-group">
            <label class="checkbox-inline">
              <input type="checkbox" ng-model="config.dblClick">Double Click</input>
            </label>
            <label class="checkbox-inline">
              <input type="checkbox" ng-model="config.multiSelect" ng-disabled="config.dblClick">Multi Select</input>
            </label>
          </div>
        </form>
      </div>
      <div class="col-md-12">
        <form role="form">
          <div class="form-group">
            <label class="checkbox-inline">
              <input type="checkbox" ng-model="showDisabled">Show Disabled Rows</input>
            </label>
           <label class="checkbox-inline">
              <input type="checkbox" ng-model="config.useExpandingRows">Show Expanding Rows</input>
           </label>
           <label class="checkbox-inline">
             <input type="checkbox" ng-model="config.itemsAvailable">Items Available</input>
           </label>
          </div>
        </form>
      </div>
      <div class="col-md-12">
        <form role="form">
          <div class="form-group">
            <label class="checkbox-inline">
              <input type="checkbox" ng-model="config.dragEnabled">Drag and Drop</input>
            </label>
          </div>
        </form>
      </div>
      <div class="col-md-12">
        <label style="font-weight:normal;vertical-align:center;">Events: </label>
      </div>
      <div class="col-md-12">
        <textarea rows="10" class="col-md-12">{{eventText}}</textarea>
      </div>
    </div>
  </file>

  <file name="script.js">
 angular.module('patternfly.views').controller('ViewCtrl', ['$scope', '$templateCache',
      function ($scope, $templateCache) {
        $scope.eventText = '';
        var handleSelect = function (item, e) {
          $scope.eventText = item.name + ' selected\r\n' + $scope.eventText;
        };
        var handleSelectionChange = function (selectedItems, e) {
          $scope.eventText = selectedItems.length + ' items selected\r\n' + $scope.eventText;
        };
        var handleClick = function (item, e) {
          $scope.eventText = item.name + ' clicked\r\n' + $scope.eventText;
        };
        var handleDblClick = function (item, e) {
          $scope.eventText = item.name + ' double clicked\r\n' + $scope.eventText;
        };
        var handleCheckBoxChange = function (item, selected, e) {
          $scope.eventText = item.name + ' checked: ' + item.selected + '\r\n' + $scope.eventText;
        };

        var checkDisabledItem = function(item) {
          return $scope.showDisabled && (item.name === "John Smith");
        };

        var dragEnd = function() {
          $scope.eventText = 'drag end\r\n' + $scope.eventText;
        };
        var dragMoved = function() {
          var index = -1;

          for (var i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i] === $scope.dragItem) {
              index = i;
              break;
            }
          }
          if (index >= 0) {
            $scope.items.splice(index, 1);
          }
          $scope.eventText = 'drag moved\r\n' + $scope.eventText;
        };
        var dragStart = function(item) {
          $scope.dragItem = item;
          $scope.eventText = item.name + ': drag start\r\n' + $scope.eventText;
        };

        $scope.enableButtonForItemFn = function(action, item) {
          return !((action.name ==='Action 2') && (item.name === "Frank Livingston")) &&
                 !(action.name === 'Start' && item.started);
        };

        $scope.updateMenuActionForItemFn = function(action, item) {
          if (action.name === 'Another Action') {
            action.isVisible = (item.name !== "John Smith");
          }
        };

        $scope.exampleChartConfig = {
          'chartId': 'pctChart',
          'units': 'GB',
          'thresholds': {
            'warning':'60',
            'error':'90'
          }
        };

        $scope.selectType = 'checkbox';
        $scope.updateSelectionType = function() {
          if ($scope.selectType === 'checkbox') {
            $scope.config.selectItems = false;
            $scope.config.showSelectBox = true;
          } else if ($scope.selectType === 'row') {
            $scope.config.selectItems = true;
            $scope.config.showSelectBox = false;
          } else {
            $scope.config.selectItems = false
            $scope.config.showSelectBox = false;
          }
        };

        $scope.showDisabled = false;

        $scope.config = {
         selectItems: false,
         multiSelect: false,
         dblClick: false,
         dragEnabled: false,
         dragEnd: dragEnd,
         dragMoved: dragMoved,
         dragStart: dragStart,
         selectionMatchProp: 'name',
         selectedItems: [],
         itemsAvailable: true,
         checkDisabled: checkDisabledItem,
         showSelectBox: true,
         useExpandingRows: false,
         onSelect: handleSelect,
         onSelectionChange: handleSelectionChange,
         onCheckBoxChange: handleCheckBoxChange,
         onClick: handleClick,
         onDblClick: handleDblClick
        };

        $scope.emptyStateConfig = {
          icon: 'pficon-warning-triangle-o',
          title: 'No Items Available',
          info: "This is the Empty State component. The goal of a empty state pattern is to provide a good first impression that helps users to achieve their goals. It should be used when a view is empty because no objects exists and you want to guide the user to perform specific actions.",
          helpLink: {
             label: 'For more information please see',
             urlLabel: 'pfExample',
             url : '#/api/patternfly.views.component:pfEmptyState'
          }
        };

        $scope.items = [
          {
            name: "Fred Flintstone",
            address: "20 Dinosaur Way",
            city: "Bedrock",
            state: "Washingstone"
          },
          {
            name: "John Smith",
            address: "415 East Main Street",
            city: "Norfolk",
            state: "Virginia",
            disableRowExpansion: true
          },
          {
            name: "Frank Livingston",
            address: "234 Elm Street",
            city: "Pittsburgh",
            state: "Pennsylvania"
          },
          {
            name: "Linda McGovern",
            address: "22 Oak Street",
            city: "Denver",
            state: "Colorado"
          },
          {
            name: "Jim Brown",
            address: "72 Bourbon Way",
            city: "Nashville",
            state: "Tennessee"
          },
          {
            name: "Holly Nichols",
            address: "21 Jump Street",
            city: "Hollywood",
            state: "California"
          },
          {
            name: "Marie Edwards",
            address: "17 Cross Street",
            city: "Boston",
            state: "Massachusetts"
          },
          {
            name: "Pat Thomas",
            address: "50 Second Street",
            city: "New York",
            state: "New York"
          },
        ];

        $scope.getMenuClass = function (item) {
          var menuClass = "";
          if (item.name === "Jim Brown") {
            menuClass = 'red';
          }
          return menuClass;
        };

        $scope.hideMenuActions = function (item) {
          return (item.name === "Marie Edwards");
        };

        var performAction = function (action, item) {
          $scope.eventText = item.name + " : " + action.name + "\r\n" + $scope.eventText;
        };

        var startServer = function (action, item) {
          $scope.eventText = item.name + " : " + action.name + "\r\n" + $scope.eventText;
          item.started = true;
        };

        var buttonInclude = '<span class="fa fa-plus"></span>{{actionButton.name}}';
        $templateCache.put('my-button-template', buttonInclude);

        var startButtonInclude = '<span ng-disabled="item.started">{{item.started ? "Starting" : "Start"}}</span>';
        $templateCache.put('start-button-template', startButtonInclude);

        $scope.actionButtons = [
          {
            name: 'Start',
            class: 'btn-primary',
            include: 'start-button-template',
            title: 'Start the server',
            actionFn: startServer
          },
          {
            name: 'Action 1',
            title: 'Perform an action',
            actionFn: performAction
          },
          {
            name: 'Action 2',
            title: 'Do something else',
            actionFn: performAction
          },
          {
            name: 'Action 3',
            include: 'my-button-template',
            title: 'Do something special',
            actionFn: performAction
          }
        ];
        $scope.menuActions = [
          {
            name: 'Action',
            title: 'Perform an action',
            actionFn: performAction
          },
          {
            name: 'Another Action',
            title: 'Do something else',
            actionFn: performAction
          },
          {
            name: 'Disabled Action',
            title: 'Unavailable action',
            actionFn: performAction,
            isDisabled: true
          },
          {
            name: 'Something Else',
            title: '',
            actionFn: performAction
          },
          {
            isSeparator: true
          },
          {
            name: 'Grouped Action 1',
            title: 'Do something',
            actionFn: performAction
          },
          {
            name: 'Grouped Action 2',
            title: 'Do something similar',
            actionFn: performAction
          }
        ];
      }
    ]);
  </file>
</example>
 */
angular.module('patternfly.views').component('pfListView', {
  bindings: {
    config: '=?',
    items: '=',
    actionButtons: '=?',
    enableButtonForItemFn: '=?',
    menuActions: '=?',
    hideMenuForItemFn: '=?',
    menuClassForItemFn: '=?',
    updateMenuActionForItemFn: '=?',
    actions: '=?',
    updateActionForItemFn: '=?',
    customScope: '=?',
    emptyStateConfig: '=?'
  },
  transclude: {
    expandedContent: '?listExpandedContent'
  },
  templateUrl: 'views/listview/list-view.html',
  controller: ["$window", "$element", function ($window, $element) {
    'use strict';
    var ctrl = this;

    var setDropMenuLocation = function (parentDiv) {
      var dropButton = parentDiv.querySelector('.dropdown-toggle');
      var dropMenu =  parentDiv.querySelector('.dropdown-menu');
      var parentRect = $element[0].getBoundingClientRect();
      var buttonRect = dropButton.getBoundingClientRect();
      var menuRect = dropMenu.getBoundingClientRect();
      var menuTop = buttonRect.top - menuRect.height;
      var menuBottom = buttonRect.top + buttonRect.height + menuRect.height;

      if ((menuBottom <= parentRect.top + parentRect.height) || (menuTop < parentRect.top)) {
        ctrl.dropdownClass = 'dropdown';
      } else {
        ctrl.dropdownClass = 'dropup';
      }
    };

    ctrl.defaultConfig = {
      selectItems: false,
      multiSelect: false,
      dblClick: false,
      dragEnabled: false,
      dragEnd: null,
      dragMoved: null,
      dragStart: null,
      selectionMatchProp: 'uuid',
      selectedItems: [],
      checkDisabled: false,
      useExpandingRows: false,
      showSelectBox: true,
      onSelect: null,
      onSelectionChange: null,
      onCheckBoxChange: null,
      onClick: null,
      onDblClick: null
    };


    ctrl.dropdownClass = 'dropdown';

    ctrl.handleButtonAction = function (action, item) {
      if (!ctrl.checkDisabled(item) && action && action.actionFn && ctrl.enableButtonForItem(action, item)) {
        action.actionFn(action, item);
      }
    };

    ctrl.handleMenuAction = function (action, item) {
      if (!ctrl.checkDisabled(item) && action && action.actionFn && (action.isDisabled !== true)) {
        action.actionFn(action, item);
      }
    };

    ctrl.enableButtonForItem = function (action, item) {
      var enable = true;
      if (typeof ctrl.enableButtonForItemFn === 'function') {
        return ctrl.enableButtonForItemFn(action, item);
      }
      return enable;
    };

    ctrl.updateActions = function (item) {
      if (typeof ctrl.updateMenuActionForItemFn === 'function') {
        ctrl.menuActions.forEach(function (action) {
          ctrl.updateMenuActionForItemFn(action, item);
        });
      }
    };

    ctrl.getMenuClassForItem = function (item) {
      var menuClass = '';
      if (angular.isFunction(ctrl.menuClassForItemFn)) {
        menuClass = ctrl.menuClassForItemFn(item);
      }

      return menuClass;
    };

    ctrl.hideMenuForItem = function (item) {
      var hideMenu = false;
      if (angular.isFunction(ctrl.hideMenuForItemFn)) {
        hideMenu = ctrl.hideMenuForItemFn(item);
      }

      return hideMenu;
    };

    ctrl.toggleItemExpansion = function (item) {
      item.isExpanded = !item.isExpanded;
    };

    ctrl.setupActions = function (item, event) {
      // Ignore disabled items completely
      if (ctrl.checkDisabled(item)) {
        return;
      }

      // update the actions based on the current item
      ctrl.updateActions(item);

      $window.requestAnimationFrame(function () {
        var parentDiv = undefined;
        var nextElement;

        nextElement = event.target;
        while (nextElement && !parentDiv) {
          if (nextElement.className.indexOf('dropdown-kebab-pf') !== -1) {
            parentDiv = nextElement;
            if (nextElement.className.indexOf('open') !== -1) {
              setDropMenuLocation (parentDiv);
            }
          }
          nextElement = nextElement.parentElement;
        }
      });
    };

    ctrl.itemClick = function (e, item) {
      var alreadySelected;
      var selectionChanged = false;
      var continueEvent = true;
      var enableRowExpansion = ctrl.config && ctrl.config.useExpandingRows && item && !item.disableRowExpansion;

      // Ignore disabled item clicks completely
      if (ctrl.checkDisabled(item)) {
        return continueEvent;
      }

      if (ctrl.config && ctrl.config.selectItems && item) {
        if (ctrl.config.multiSelect && !ctrl.config.dblClick) {

          alreadySelected = _.find(ctrl.config.selectedItems, function (itemObj) {
            return itemObj === item;
          });

          if (alreadySelected) {
            // already selected so deselect
            ctrl.config.selectedItems = _.without(ctrl.config.selectedItems, item);
          } else {
            // add the item to the selected items
            ctrl.config.selectedItems.push(item);
            selectionChanged = true;
          }
        } else {
          if (ctrl.config.selectedItems[0] === item) {
            if (!ctrl.config.dblClick) {
              ctrl.config.selectedItems = [];
              selectionChanged = true;
            }
            continueEvent = false;
          } else {
            ctrl.config.selectedItems = [item];
            selectionChanged = true;
          }
        }

        if (selectionChanged && ctrl.config.onSelect) {
          ctrl.config.onSelect(item, e);
        }
        if (selectionChanged && ctrl.config.onSelectionChange) {
          ctrl.config.onSelectionChange(ctrl.config.selectedItems, e);
        }
      }
      if (ctrl.config.onClick) {
        if (ctrl.config.onClick(item, e) !== false && enableRowExpansion) {
          ctrl.toggleItemExpansion(item);
        }
      } else if (enableRowExpansion) {
        ctrl.toggleItemExpansion(item);
      }

      return continueEvent;
    };

    ctrl.dblClick = function (e, item) {
      // Ignore disabled item clicks completely
      if (ctrl.checkDisabled(item)) {
        return continueEvent;
      }

      if (ctrl.config.onDblClick) {
        ctrl.config.onDblClick(item, e);
      }
    };

    ctrl.checkBoxChange = function (item) {
      if (ctrl.config.onCheckBoxChange) {
        ctrl.config.onCheckBoxChange(item);
      }
    };

    ctrl.isSelected = function (item) {
      var matchProp = ctrl.config.selectionMatchProp;
      var selected = false;

      if (ctrl.config.showSelectBox) {
        selected = item.selected;
      } else if (ctrl.config.selectItems && ctrl.config.selectedItems.length) {
        selected = _.find(ctrl.config.selectedItems, function (itemObj) {
          return itemObj[matchProp] === item[matchProp];
        });
      }
      return selected;
    };

    ctrl.checkDisabled = function (item) {
      return ctrl.config.checkDisabled && ctrl.config.checkDisabled(item);
    };

    ctrl.$onInit = function () {
      // Setting bound variables to new variables loses it's binding
      //   ctrl.config = pfUtils.merge(ctrl.defaultConfig, ctrl.config);
      // Instead, use _.defaults to update the existing variable
      _.defaults(ctrl.config, ctrl.defaultConfig);
      if (!ctrl.config.selectItems) {
        ctrl.config.selectedItems = [];
      }
      if (!ctrl.config.multiSelect && ctrl.config.selectedItems && ctrl.config.selectedItems.length > 0) {
        ctrl.config.selectedItems = [ctrl.config.selectedItems[0]];
      }
      if (ctrl.config.selectItems && ctrl.config.showSelectBox) {
        throw new Error('pfListView - ' +
          'Illegal use of pListView component! ' +
          'Cannot allow both select box and click selection in the same list view.');
      }
    };

    ctrl.dragEnd = function () {
      if (angular.isFunction(ctrl.config.dragEnd)) {
        ctrl.config.dragEnd();
      }
    };

    ctrl.dragMoved = function () {
      if (angular.isFunction(ctrl.config.dragMoved)) {
        ctrl.config.dragMoved();
      }
    };

    ctrl.isDragOriginal = function (item) {
      return (item === ctrl.dragItem);
    };

    ctrl.dragStart = function (item) {
      ctrl.dragItem = item;

      if (angular.isFunction(ctrl.config.dragStart)) {
        ctrl.config.dragStart(item);
      }
    };
  }]
});
;(function () {
  'use strict';

  angular.module('patternfly.views').constant('pfViewUtils', {
    getDashboardView: function (title) {
      return {
        id: 'dashboardView',
        title: title || 'Dashboard View',
        iconClass: 'fa fa-dashboard'
      };
    },
    getCardView: function (title) {
      return {
        id: 'cardView',
        title: title || 'Card View',
        iconClass: 'fa fa-th'
      };
    },
    getListView: function (title) {
      return {
        id: 'listView',
        title: title || 'List View',
        iconClass: 'fa fa-th-list'
      };
    },
    getTableView: function (title) {
      return {
        id: 'tableView',
        title: title || 'Table View',
        iconClass: 'fa fa-table'
      };
    },
    getTopologyView: function (title) {
      return {
        id: 'topologyView',
        title: title || 'Topology View',
        iconClass: 'fa fa-sitemap'
      };
    }
  });
})();
;(function () {
  'use strict';
  function pfWizardButtonComponent (action) {
    angular.module('patternfly.wizard')
      .component(action, {
        bindings: {
          callback: "=?"
        },
        controller: function ($element, $scope) {
          var ctrl = this;

          var findWizard = function (scope) {
            var wizard;

            if (scope) {
              if (angular.isDefined(scope.wizard)) {
                wizard = scope.wizard;
              } else {
                wizard = findWizard(scope.$parent);
              }
            }

            return wizard;
          };

          ctrl.$onInit = function () {
            $scope.wizard = findWizard($scope);
          };

          ctrl.$postLink = function () {
            $element.on("click", function (e) {
              e.preventDefault();
              $scope.$apply(function () {
                // scope apply in button module
                $scope.wizard[action.replace("pfWiz", "").toLowerCase()]($scope.callback);
              });
            });
          };
        }
      });
  }

  pfWizardButtonComponent('pfWizNext');
  pfWizardButtonComponent('pfWizPrevious');
  pfWizardButtonComponent('pfWizFinish');
  pfWizardButtonComponent('pfWizCancel');
  pfWizardButtonComponent('pfWizReset');
})();
;/**
 * @ngdoc directive
 * @name patternfly.wizard.component:pfWizardReviewPage
 * @restrict E
 *
 * @description
 * Component for rendering a Wizard Review Page - should only be used within a wizard.
 *
 * @param {boolean} shown Value watched internally by the wizard review page to know when it is visible.
 * @param {object} wizardData  Sets the internal content of the review page to apply wizard data to the review templates.
 *
 */
angular.module('patternfly.wizard').component('pfWizardReviewPage', {
  bindings: {
    shown: '<',
    wizardData: "<"
  },
  templateUrl: 'wizard/wizard-review-page.html',
  controller: ["$scope", function ($scope) {
    'use strict';
    var ctrl = this;

    var findWizard = function (scope) {
      var wizard;
      if (scope) {
        if (angular.isDefined(scope.wizard)) {
          wizard = scope.wizard;
        } else {
          wizard = findWizard(scope.$parent);
        }
      }

      return wizard;
    };

    ctrl.$onInit = function () {
      ctrl.reviewSteps = [];
      ctrl.wizard = findWizard($scope.$parent);
    };

    ctrl.$onChanges = function (changesObj) {
      if (changesObj.shown) {
        if (changesObj.shown.currentValue) {
          ctrl.updateReviewSteps();
        }
      }
    };

    ctrl.toggleShowReviewDetails = function (step) {
      if (step.showReviewDetails === true) {
        step.showReviewDetails = false;
      } else {
        step.showReviewDetails = true;
      }
    };

    ctrl.getSubStepNumber = function (step, substep) {
      return step.getStepDisplayNumber(substep);
    };

    ctrl.getReviewSubSteps = function (reviewStep) {
      return reviewStep.getReviewSteps();
    };

    ctrl.updateReviewSteps = function () {
      ctrl.reviewSteps = ctrl.wizard.getReviewSteps();
    };
  }]
});
;/**
 * @ngdoc directive
 * @name patternfly.wizard.component:pfWizardStep
 * @restrict E
 *
 * @description
 * Component for rendering a Wizard step.  Each step can stand alone or have substeps.  This directive can only be used as a child of pf-wizard.
 *
 * @param {string} stepTitle The step title displayed in the header and used for the review screen when displayed
 * @param {string} stepId  Sets the text identifier of the step
 * @param {number} stepPriority  This sets the priority of this wizard step relative to other wizard steps.  They should be numbered sequentially in the order they should be viewed.
 * @param {boolean} substeps Sets whether this step has substeps
 * @param {boolean=} nextEnabled Sets whether the next button should be enabled when this step is first displayed
 * @param {boolean=} prevEnabled Sets whether the back button should be enabled when this step is first displayed
 * @param {string=} nextTooltip The text to display as a tooltip on the next button
 * @param {string=} prevTooltip The text to display as a tooltip on the back button
 * @param {boolean=} wzDisabled Disables the wizard when this page is shown
 * @param {boolean} okToNavAway Sets whether or not it's ok for the user to leave this page
 * @param {boolean} allowClickNav Sets whether the user can click on the numeric step indicators to navigate directly to this step
 * @param {string=} description The step description (optional)
 * @param {object} wizardData Data passed to the step that is shared by the entire wizard
 * @param {function()=} onShow The function called when the wizard shows this step
 * @param {boolean=} showReview Indicates whether review information should be displayed for this step when the review step is reached
 * @param {boolean=} showReviewDetails Indicators whether the review information should be expanded by default when the review step is reached
 * @param {string=} reviewTemplate The template that should be used for the review details screen
 */
angular.module('patternfly.wizard').component('pfWizardStep', {
  transclude: true,
  bindings: {
    stepTitle: '@',
    stepId: '@',
    stepPriority: '@',
    substeps: '=?',
    nextEnabled: '<?',
    prevEnabled: '<?',
    nextTooltip: '<?',
    prevTooltip: '<?',
    disabled: '@?wzDisabled',
    okToNavAway: '<?',
    allowClickNav: '<?',
    description: '@',
    wizardData: '=',
    onShow: '=?',
    showReview: '@?',
    showReviewDetails: '@?',
    reviewTemplate: '@?'
  },
  templateUrl: 'wizard/wizard-step.html',
  controller: ["$timeout", "$scope", function ($timeout, $scope) {
    'use strict';

    var ctrl = this,
      firstRun;

    var stepIdx = function (step) {
      var idx = 0;
      var res = -1;
      angular.forEach(ctrl.getEnabledSteps(), function (currStep) {
        if (currStep === step) {
          res = idx;
        }
        idx++;
      });
      return res;
    };

    var unselectAll = function () {
      //traverse steps array and set each "selected" property to false
      angular.forEach(ctrl.getEnabledSteps(), function (step) {
        step.selected = false;
      });
      //set selectedStep variable to null
      ctrl.selectedStep = null;
    };

    var stepByTitle = function (titleToFind) {
      var foundStep = null;
      angular.forEach(ctrl.getEnabledSteps(), function (step) {
        if (step.stepTitle === titleToFind) {
          foundStep = step;
        }
      });
      return foundStep;
    };

    var findWizard = function (scope) {
      var wizard;
      if (scope) {
        if (angular.isDefined(scope.wizard)) {
          wizard = scope.wizard;
        } else {
          wizard = findWizard(scope.$parent);
        }
      }

      return wizard;
    };

    ctrl.$onInit = function () {
      firstRun = true;
      ctrl.steps = [];
      ctrl.context = {};
      ctrl.title =  ctrl.stepTitle;
      ctrl.wizard = findWizard($scope.$parent);
      ctrl.contentStyle = ctrl.wizard.contentStyle;

      // Provide wizard step controls to sub-steps
      $scope.wizardStep = this;

      ctrl.wizard.addStep(ctrl);
      ctrl.pageNumber = ctrl.wizard.getStepNumber(ctrl);

      if (angular.isUndefined(ctrl.nextEnabled)) {
        ctrl.nextEnabled = true;
      }
      if (angular.isUndefined(ctrl.prevEnabled)) {
        ctrl.prevEnabled = true;
      }
      if (angular.isUndefined(ctrl.showReview)) {
        ctrl.showReview = false;
      }
      if (angular.isUndefined(ctrl.showReviewDetails)) {
        ctrl.showReviewDetails = false;
      }
      if (angular.isUndefined(ctrl.stepPriority)) {
        ctrl.stepPriority = 999;
      } else {
        ctrl.stepPriority = parseInt(ctrl.stepPriority);
      }
      if (angular.isUndefined(ctrl.okToNavAway)) {
        ctrl.okToNavAway = true;
      }
      if (angular.isUndefined(ctrl.allowClickNav)) {
        ctrl.allowClickNav = true;
      }

      if (ctrl.substeps && !ctrl.onShow) {
        ctrl.onShow = function () {
          $timeout(function () {
            if (!ctrl.selectedStep) {
              ctrl.goTo(ctrl.getEnabledSteps()[0]);
            }
          }, 10);
        };
      }
    };

    ctrl.$onChanges = function (changesObj) {
      if (changesObj.nextTooltip) {
        ctrl.wizard.nextTooltip = changesObj.nextTooltip.currentValue;
      }

      if (changesObj.prevTooltip) {
        ctrl.wizard.prevTooltip = changesObj.prevTooltip.currentValue;
      }
    };

    ctrl.getEnabledSteps = function () {
      return ctrl.steps.filter(function (step) {
        return step.disabled !== 'true';
      });
    };

    ctrl.getReviewSteps = function () {
      var reviewSteps = ctrl.getEnabledSteps().filter(function (step) {
        return !angular.isUndefined(step.reviewTemplate);
      });
      return reviewSteps;
    };

    ctrl.resetNav = function () {
      ctrl.goTo(ctrl.getEnabledSteps()[0]);
    };

    ctrl.currentStepNumber = function () {
      //retrieve current step number
      return stepIdx(ctrl.selectedStep) + 1;
    };

    ctrl.getStepNumber = function (step) {
      return stepIdx(step) + 1;
    };

    ctrl.isNextEnabled = function () {
      var enabled = angular.isUndefined(ctrl.nextEnabled) || ctrl.nextEnabled;
      if (ctrl.substeps) {
        angular.forEach(ctrl.getEnabledSteps(), function (step) {
          enabled = enabled && step.nextEnabled;
        });
      }
      return enabled;
    };

    ctrl.isPrevEnabled = function () {
      var enabled = angular.isUndefined(ctrl.prevEnabled) || ctrl.prevEnabled;
      if (ctrl.substeps) {
        angular.forEach(ctrl.getEnabledSteps(), function (step) {
          enabled = enabled && step.prevEnabled;
        });
      }
      return enabled;
    };

    ctrl.getStepDisplayNumber = function (step) {
      return ctrl.pageNumber +  String.fromCharCode(65 + stepIdx(step)) + ".";
    };

    ctrl.prevStepsComplete = function (nextStep) {
      var nextIdx = stepIdx(nextStep);
      var complete = true;
      angular.forEach(ctrl.getEnabledSteps(), function (step, stepIndex) {
        if (stepIndex <  nextIdx) {
          complete = complete && step.nextEnabled;
        }
      });
      return complete;
    };

    ctrl.goTo = function (step) {
      if (ctrl.wizard.isWizardDone() || !step.okToNavAway || step === ctrl.selectedStep) {
        return;
      }

      if (firstRun || (ctrl.getStepNumber(step) < ctrl.currentStepNumber() && ctrl.selectedStep.prevEnabled) || ctrl.prevStepsComplete(step)) {
        unselectAll();
        ctrl.selectedStep = step;
        if (step) {
          step.selected = true;
          ctrl.wizard.setPageSelected(step);

          if (angular.isFunction (ctrl.selectedStep.onShow)) {
            ctrl.selectedStep.onShow();
          }

          ctrl.currentStep = step.stepTitle;

          firstRun = false;
        }
        ctrl.wizard.updateSubStepNumber (stepIdx(ctrl.selectedStep));
      }
    };

    ctrl.stepClick = function (step) {
      if (step.allowClickNav) {
        ctrl.goTo(step);
      }
    };

    ctrl.addStep = function (step) {
      // Insert the step into step array
      var insertBefore = _.find(ctrl.steps, function (nextStep) {
        return nextStep.stepPriority > step.stepPriority;
      });
      if (insertBefore) {
        ctrl.steps.splice(ctrl.steps.indexOf(insertBefore), 0, step);
      } else {
        ctrl.steps.push(step);
      }
    };

    ctrl.currentStepTitle = function () {
      return ctrl.selectedStep.stepTitle;
    };

    ctrl.currentStepDescription = function () {
      return ctrl.selectedStep.description;
    };

    ctrl.currentStep = function () {
      return ctrl.selectedStep;
    };

    ctrl.totalStepCount = function () {
      return ctrl.getEnabledSteps().length;
    };

    // Method used for next button within step
    ctrl.next = function (callback) {
      var enabledSteps = ctrl.getEnabledSteps();

      // Save the step  you were on when next() was invoked
      var index = stepIdx(ctrl.selectedStep);

      // Check if callback is a function
      if (angular.isFunction (callback)) {
        if (callback(ctrl.selectedStep)) {
          if (index === enabledSteps.length - 1) {
            return false;
          }
          // Go to the next step
          ctrl.goTo(enabledSteps[index + 1]);
          return true;
        }
        return true;
      }

      // Completed property set on scope which is used to add class/remove class from progress bar
      ctrl.selectedStep.completed = true;

      // Check to see if this is the last step.  If it is next behaves the same as finish()
      if (index === enabledSteps.length - 1) {
        return false;
      }
      // Go to the next step
      ctrl.goTo(enabledSteps[index + 1]);
      return true;
    };

    ctrl.previous = function (callback) {
      var index = stepIdx(ctrl.selectedStep);
      var goPrev = false;

      // Check if callback is a function
      if (!angular.isFunction (callback) || callback(ctrl.selectedStep)) {
        if (index !== 0) {
          ctrl.goTo(ctrl.getEnabledSteps()[index - 1]);
          goPrev = true;
        }
      }
      return goPrev;
    };
  }]
});
;/** @ngdoc directive
* @name patternfly.wizard.component:pfWizardSubstep
* @restrict E
*
* @description
* Component for rendering a Wizard substep.  Each substep must be a child of a pf-wizardstep in a pf-wizard directive.
*
* @param {string} stepTitle The step title displayed in the header and used for the review screen when displayed
* @param {string} stepId  Sets the text identifier of the step
* @param {number} stepPriority  This sets the priority of this wizard step relative to other wizard steps.  They should be numbered sequentially in the order they should be viewed.
* @param {boolean=} nextEnabled Sets whether the next button should be enabled when this step is first displayed
* @param {boolean=} prevEnabled Sets whether the back button should be enabled when this step is first displayed
* @param {boolean=} wzDisabled Disables the wizard when this page is shown
* @param {boolean} okToNavAway Sets whether or not it's ok for the user to leave this page
* @param {boolean=} allowClickNav Sets whether the user can click on the numeric step indicators to navigate directly to this step
* @param {string=} description The step description
* @param {object} wizardData Data passed to the step that is shared by the entire wizard
* @param {function()=} onShow The function called when the wizard shows this step
* @param {boolean=} showReviewDetails Indicators whether the review information should be expanded by default when the review step is reached
* @param {string=} reviewTemplate The template that should be used for the review details screen
*/
angular.module('patternfly.wizard').component('pfWizardSubstep', {
  transclude: true,
  bindings: {
    stepTitle: '@',
    stepId: '@',
    stepPriority: '@',
    nextEnabled: '<?',
    prevEnabled: '<?',
    okToNavAway: '<?',
    allowClickNav: '<?',
    disabled: '@?wzDisabled',
    description: '@',
    wizardData: '=',
    onShow: '=?',
    showReviewDetails: '@?',
    reviewTemplate: '@?'
  },
  templateUrl: 'wizard/wizard-substep.html',
  controller: ["$scope", function ($scope) {
    'use strict';
    var ctrl = this;

    ctrl.$onInit = function () {
      var findWizardStep = function (scope) {
        var wizardStep;

        if (scope) {
          if (angular.isDefined(scope.wizardStep)) {
            wizardStep = scope.wizardStep;
          } else {
            wizardStep = findWizardStep(scope.$parent);
          }
        }

        return wizardStep;
      };

      ctrl.step = findWizardStep($scope);

      if (angular.isUndefined(ctrl.nextEnabled)) {
        ctrl.nextEnabled = true;
      }
      if (angular.isUndefined(ctrl.prevEnabled)) {
        ctrl.prevEnabled = true;
      }
      if (angular.isUndefined(ctrl.showReviewDetails)) {
        ctrl.showReviewDetails = false;
      }
      if (angular.isUndefined(ctrl.stepPriority)) {
        ctrl.stepPriority = 999;
      } else {
        ctrl.stepPriority = parseInt(ctrl.stepPriority);
      }
      if (angular.isUndefined(ctrl.okToNavAway)) {
        ctrl.okToNavAway = true;
      }
      if (angular.isUndefined(ctrl.allowClickNav)) {
        ctrl.allowClickNav = true;
      }


      ctrl.step.nextEnabled = ctrl.nextEnabled;
      ctrl.step.prevEnabled = ctrl.prevEnabled;
      ctrl.step.okToNavAway = ctrl.okToNavAway;
      ctrl.step.allowClickNav = ctrl.allowClickNav;

      ctrl.title = ctrl.stepTitle;
      ctrl.step.addStep(ctrl);
    };

    ctrl.$onChanges = function (changesObj) {
      if (!ctrl.step) {
        return;
      }

      if (changesObj.nextEnabled) {
        ctrl.step.nextEnabled = changesObj.nextEnabled.currentValue;
      }

      if (changesObj.prevEnabled) {
        ctrl.step.prevEnabled = changesObj.prevEnabled.currentValue;
      }

      if (changesObj.okToNavAway) {
        ctrl.step.okToNavAway = changesObj.okToNavAway.currentValue;
      }

      if (changesObj.allowClickNav) {
        ctrl.step.allowClickNav = changesObj.allowClickNav.currentValue;
      }
    };

    ctrl.isPrevEnabled = function () {
      var enabled = angular.isUndefined(ctrl.prevEnabled) || ctrl.prevEnabled;
      if (ctrl.substeps) {
        angular.forEach(ctrl.getEnabledSteps(), function (step) {
          enabled = enabled && step.prevEnabled;
        });
      }
      return enabled;
    };
  }]
});
;/**
  * @ngdoc directive
  * @name patternfly.wizard.component:pfWizard
  * @restrict E
  *
  * @description
  * Component for rendering a Wizard modal.  Each wizard dynamically creates the step navigation both in the header and the left-hand side based on nested steps.
  * Use pf-wizard-step to define individual steps within a wizard and pf-wizard-substep to define portions of pf-wizard-steps if so desired.  For instance, Step one can have two substeps - 1A and 1B when it is logical to group those together.
  * <br /><br />
  * The basic structure should be:
  * <pre>
  * <pf-wizard>
  *   <pf-wizard-step>
  *     <pf-wizard-substep><!-- content here --></pf-wizard-substep>
  *     <pf-wizard-substep><!-- content here --></pf-wizard-substep>
  *   </pf-wizard-step>
  *   <pf-wizard-step><!-- additional configuration can be added here with substeps if desired --></pf-wizard-step>
  *   <pf-wizard-step><!-- review steps and final command here --></pf-wizard-step>
  * </pf-wizard>
  * </pre>
  *
  * @param {string} title The wizard title displayed in the header
  * @param {boolean=} hideIndicators  Hides the step indicators in the header of the wizard
  * @param {boolean=} hideSidebar  Hides page navigation sidebar on the wizard pages
  * @param {boolean=} hideHeader Optional value to hide the title bar. Default is false.
  * @param {boolean=} hideBackButton Optional value to hide the back button, useful in 2 step wizards. Default is false.
  * @param {string=} stepClass Optional CSS class to be given to the steps page container. Used for the sidebar panel as well unless a sidebarClass is provided.
  * @param {string=} sidebarClass Optional CSS class to be give to the sidebar panel. Only used if the stepClass is also provided.
  * @param {string=} contentHeight The height the wizard content should be set to. This is used ONLY if the stepClass is not given. This defaults to 300px if the property is not supplied.
  * @param {boolean=} hideIndicators  Hides the step indicators in the header of the wizard
  * @param {string=} currentStep The current step can be changed externally - this is the title of the step to switch the wizard to
  * @param {string=} cancelTitle The text to display on the cancel button
  * @param {string=} backTitle The text to display on the back button
  * @param {string=} nextTitle The text to display on the next button
  * @param {function(step)=} backCallback Called to notify when the back button is clicked
  * @param {function(step)=} nextCallback Called to notify when the next button is clicked
  * @param {function()=} onFinish Called to notify when when the wizard is complete.  Returns a boolean value to indicate if the finish operation is complete
  * @param {function()=} onCancel Called when the wizard is canceled, returns a boolean value to indicate if cancel is successful
  * @param {boolean} wizardReady Value that is set when the wizard is ready
  * @param {boolean=} wizardDone  Value that is set when the wizard is done
  * @param {string} loadingWizardTitle The text displayed when the wizard is loading
  * @param {string=} loadingSecondaryInformation Secondary descriptive information to display when the wizard is loading
  * @param {boolean=} embedInPage Value that indicates wizard is embedded in a page (not a modal).  This moves the navigation buttons to the left hand side of the footer and removes the close button.
  * @param {function(step, index)=} onStepChanged Called when the wizard step is changed, passes in the step and the step index of the step changed to
  *
  * @example
  <example module="patternfly.wizard" deps="patternfly.form">
  <file name="index.html">
    <div ng-controller="WizardModalController">
      <button ng-click="openWizardModel()" class="btn btn-default">Launch Wizard</button>
    </div>
  </file>
  <file name="wizard-container.html">
  <pf-wizard title="Wizard Title"
    wizard-ready="deployProviderReady"
    on-finish="finishedWizard()"
    on-cancel="cancelDeploymentWizard()"
    next-title="nextButtonTitle"
    next-callback="nextCallback"
    back-callback="backCallback"
    wizard-done="deployComplete || deployInProgress"
    sidebar-class="example-wizard-sidebar"
    step-class="example-wizard-step"
    loading-secondary-information="secondaryLoadInformation"
    on-step-changed="stepChanged(step, index)">
      <pf-wizard-step step-title="First Step" substeps="true" step-id="details" step-priority="0" show-review="true" show-review-details="true">
        <div ng-include="'detail-page.html'">
        </div>
        <pf-wizard-substep step-title="Details - Extra" next-enabled="true" step-id="details-extra" step-priority="1" show-review="true" show-review-details="true" review-template="review-second-template.html">
          <form class="form-horizontal">
            <pf-form-group pf-label="Lorem" required>
              <input id="new-lorem" name="lorem" ng-model="data.lorem" type="text" required/>
            </pf-form-group>
            <pf-form-group pf-label="Ipsum">
              <input id="new-ipsum" name="ipsum" ng-model="data.ipsum" type="text" />
            </pf-form-group>
          </form>
        </pf-wizard-substep>
      </pf-wizard-step>
      <pf-wizard-step step-title="Second Step" substeps="false" step-id="configuration" step-priority="1" show-review="true" review-template="review-second-template.html" >
        <form class="form-horizontal">
          <h3>Wizards should make use of substeps consistently throughout (either using them or not using them).  This is an example only.</h3>
          <pf-form-group pf-label="Lorem">
            <input id="new-lorem" name="lorem" ng-model="data.lorem" type="text"/>
          </pf-form-group>
          <pf-form-group pf-label="Ipsum">
            <input id="new-ipsum" name="ipsum" ng-model="data.ipsum" type="text" />
          </pf-form-group>
        </form>
      </pf-wizard-step>
      <pf-wizard-step step-title="Review" substeps="true" step-id="review" step-priority="2">
        <div ng-include="'summary.html'"></div>
        <div ng-include="'deployment.html'"></div>
      </pf-wizard-step>
   </pf-wizard>
  </file>
  <file name="detail-page.html">
    <div ng-controller="DetailsGeneralController">
       <pf-wizard-substep step-title="General" next-enabled="detailsGeneralComplete" step-id="details-general" step-priority="0" on-show="onShow" review-template="{{reviewTemplate}}" show-review-details="true">
         <form class="form-horizontal">
           <pf-form-group pf-label="Name" required>
              <input id="new-name" name="name" ng-model="data.name" type="text" ng-change="updateName()" required/>
           </pf-form-group>
           <pf-form-group pf-label="Description">
             <input id="new-description" name="description" ng-model="data.description" type="text" />
           </pf-form-group>
         </form>
      </pf-wizard-substep>
    </div>
  </file>
  <file name="review-template.html">
  <div ng-controller="DetailsReviewController">
    <form class="form">
      <div class="wizard-pf-review-item">
        <span class="wizard-pf-review-item-label">Name:</span>
        <span class="wizard-pf-review-item-value">{{data.name}}</span>
      </div>
      <div class="wizard-pf-review-item">
        <span class="wizard-pf-review-item-label">Description:</span>
        <span class="wizard-pf-review-item-value">{{data.description}}</span>
      </div>
    </form>
  </div>
  </file>
  <file name="review-second-template.html">
  <div ng-controller="DetailsReviewController">
    <form class="form">
      <div class="wizard-pf-review-item">
        <span class="wizard-pf-review-item-label">Lorem:</span>
        <span class="wizard-pf-review-item-value">{{data.lorem}}</span>
      </div>
      <div class="wizard-pf-review-item">
        <span class="wizard-pf-review-item-label">Ipsum:</span>
        <span class="wizard-pf-review-item-value">{{data.ipsum}}</span>
      </div>
    </form>
  </div>
  </file>
  <file name="summary.html">
  <div ng-controller="SummaryController">
    <pf-wizard-substep step-title="Summary" step-id="review-summary" step-priority="0" next-enabled="true" prev-enabled="true" ok-to-nav-away="true" wz-disabled="false" on-show="onShow">
      <pf-wizard-review-page shown="pageShown" wizard-data="data"></pf-wizard-review-page>
    </pf-wizard-substep>
  </div>
  </file>
  <file name="deployment.html">
  <div ng-controller="DeploymentController">
    <pf-wizard-substep step-title="Deploy" step-id="review-progress" step-priority="1" next-enabled="true" prev-enabled="false" ok-to-nav-away="true" wz-disabled="false" on-show="onShow">
      <div class="wizard-pf-contents" ng-controller="DeploymentController">
        <div class="wizard-pf-process blank-slate-pf" ng-if="!deploymentComplete">
          <div class="spinner spinner-lg blank-slate-pf-icon"></div>
          <h3 class="blank-slate-pf-main-action">Deployment in progress</h3>
          <p class="blank-slate-pf-secondary-action">Lorem ipsum dolor sit amet, porta at suspendisse ac, ut wisi vivamus, lorem sociosqu eget nunc amet. </p>
        </div>
        <div class="wizard-pf-complete blank-slate-pf" ng-if="deploymentComplete">
          <div class="wizard-pf-success-icon"><span class="glyphicon glyphicon-ok-circle"></span></div>
          <h3 class="blank-slate-pf-main-action">Deployment was successful</h3>
          <p class="blank-slate-pf-secondary-action">Lorem ipsum dolor sit amet, porta at suspendisse ac, ut wisi vivamus, lorem sociosqu eget nunc amet. </p>
          <button type="button" class="btn btn-lg btn-primary">View Deployment</button>
        </div>
     </div>
   </pf-wizard-substep>
  </div>
  </file>
  <file name="script.js">
  angular.module('patternfly.wizard').controller('WizardModalController', ['$scope', '$timeout', '$uibModal', '$rootScope',
    function ($scope, $timeout, $uibModal, $rootScope) {
      $scope.openWizardModel = function () {
        var wizardDoneListener,
            modalInstance = $uibModal.open({
              animation: true,
              backdrop: 'static',
              templateUrl: 'wizard-container.html',
              controller: 'WizardController',
              size: 'lg'
            });

        var closeWizard = function (e, reason) {
          modalInstance.dismiss(reason);
          wizardDoneListener();
        };

        modalInstance.result.then(function () { }, function () { });

        wizardDoneListener = $rootScope.$on('wizard.done', closeWizard);
      };
    }
  ]);
  angular.module('patternfly.wizard').controller('WizardController', ['$scope', '$timeout', '$rootScope',
    function ($scope, $timeout, $rootScope) {


      var initializeWizard = function () {
        $scope.data = {
          name: '',
          description: '',
          lorem: 'default setting',
          ipsum: ''
        };
        $scope.secondaryLoadInformation = 'ipsum dolor sit amet, porta at suspendisse ac, ut wisi vivamus, lorem sociosqu eget nunc amet.';
        $timeout(function () {
          $scope.deployReady = true;
        }, 1000);
        $scope.nextButtonTitle = "Next >";
      };

      var startDeploy = function () {
        $timeout(function() { }, 10000);
        $scope.deployInProgress = true;
      };

      $scope.data = {};

      $scope.nextCallback = function (step) {
        // call startdeploy after deploy button is clicked on review-summary tab
        if (step.stepId === 'review-summary') {
          startDeploy();
        }
        return true;
      };
      $scope.backCallback = function (step) {
        return true;
      };

      $scope.stepChanged = function (step, index) {
        if (step.stepId === 'review-summary') {
          $scope.nextButtonTitle = "Deploy";
        } else if (step.stepId === 'review-progress') {
          $scope.nextButtonTitle = "Close";
        } else {
          $scope.nextButtonTitle = "Next >";
        }
      };

      $scope.cancelDeploymentWizard = function () {
        $rootScope.$emit('wizard.done', 'cancel');
      };

      $scope.finishedWizard = function () {
        $rootScope.$emit('wizard.done', 'done');
        return true;
      };

      initializeWizard();
     }
  ]);

  angular.module('patternfly.wizard').controller('DetailsGeneralController', ['$rootScope', '$scope',
    function ($rootScope, $scope) {
      'use strict';

      $scope.reviewTemplate = "review-template.html";
      $scope.detailsGeneralComplete = false;

      $scope.onShow = function() { };

      $scope.updateName = function() {
        $scope.detailsGeneralComplete = angular.isDefined($scope.data.name) && $scope.data.name.length > 0;
      };
    }
  ]);

  angular.module('patternfly.wizard').controller('DetailsReviewController', ['$rootScope', '$scope',
    function ($rootScope, $scope) {
      'use strict';

      // Find the data!
      var next = $scope;
      while (angular.isUndefined($scope.data)) {
        next = next.$parent;
        if (angular.isUndefined(next)) {
          $scope.data = {};
        } else {
          $scope.data = next.$ctrl.wizardData;
        }
      }
    }
  ]);

  angular.module('patternfly.wizard').controller('SummaryController', ['$rootScope', '$scope', '$timeout',
    function ($rootScope, $scope, $timeout) {
      'use strict';
      $scope.pageShown = false;

      $scope.onShow = function () {
        $scope.pageShown = true;
        $timeout(function () {
          $scope.pageShown = false;  // done so the next time the page is shown it updates
        });
      }
    }
  ]);

  angular.module('patternfly.wizard').controller('DeploymentController', ['$rootScope', '$scope', '$timeout',
    function ($rootScope, $scope, $timeout) {
      'use strict';

      $scope.onShow = function() {
        $scope.deploymentComplete = false;
        $timeout(function() {
          $scope.deploymentComplete = true;
        }, 2500);
      };
    }
  ]);
</file>
</example>
*/

angular.module('patternfly.wizard').component('pfWizard', {
  transclude: true,
  bindings: {
    title: '@',
    hideIndicators: '=?',
    hideSidebar: '@',
    hideHeader: '@',
    hideBackButton: '@',
    sidebarClass: '@',
    stepClass: '@',
    contentHeight: '=?',
    currentStep: '<?',
    cancelTitle: '=?',
    backTitle: '=?',
    nextTitle: '=?',
    backCallback: '=?',
    nextCallback: '=?',
    onFinish: '&',
    onCancel: '&',
    wizardReady: '=?',
    wizardDone: '=?',
    loadingWizardTitle: '=?',
    loadingSecondaryInformation: '=?',
    embedInPage: '=?',
    onStepChanged: '&?'
  },
  templateUrl: 'wizard/wizard.html',
  controller: ["$timeout", "$scope", function ($timeout, $scope) {
    'use strict';
    var ctrl = this,
      firstRun;

    var stepIdx = function (step) {
      var idx = 0;
      var res = -1;
      angular.forEach(ctrl.getEnabledSteps(), function (currStep) {
        if (currStep === step) {
          res = idx;
        }
        idx++;
      });
      return res;
    };

    var unselectAll = function () {
      //traverse steps array and set each "selected" property to false
      angular.forEach(ctrl.getEnabledSteps(), function (step) {
        step.selected = false;
      });
      //set selectedStep variable to null
      ctrl.selectedStep = null;
    };

    var stepByTitle = function (titleToFind) {
      var foundStep = null;
      angular.forEach(ctrl.getEnabledSteps(), function (step) {
        if (step.title === titleToFind) {
          foundStep = step;
        }
      });
      return foundStep;
    };

    ctrl.$onInit = function () {
      firstRun = true;
      ctrl.steps = [];
      ctrl.context = {};
      ctrl.hideHeader = ctrl.hideHeader === 'true';
      ctrl.hideSidebar = ctrl.hideSidebar === 'true';
      ctrl.hideBaackButton = ctrl.hideBackButton === 'true';

      // If a step class is given use it for all steps
      if (angular.isDefined(ctrl.stepClass)) {

        // If a sidebarClass is given, us it for sidebar panel, if not, apply the stepsClass to the sidebar panel
        if (angular.isUndefined(ctrl.sidebarClass)) {
          ctrl.sidebarClass = ctrl.stepClass;
        }
      } else {
        // No step claass give, setup the content style to allow scrolling and a fixed height
        if (angular.isUndefined(ctrl.contentHeight)) {
          ctrl.contentHeight = '300px';
        }
        ctrl.contentStyle = {
          'height': ctrl.contentHeight,
          'max-height': ctrl.contentHeight,
          'overflow-y': 'auto'
        };
      }

      if (angular.isUndefined(ctrl.wizardReady)) {
        ctrl.wizardReady = true;
      }

      if (!ctrl.cancelTitle) {
        ctrl.cancelTitle = "Cancel";
      }
      if (!ctrl.backTitle) {
        ctrl.backTitle = "< Back";
      }
      if (!ctrl.nextTitle) {
        ctrl.nextTitle = "Next >";
      }
    };

    ctrl.$onChanges = function (changesObj) {
      var step;

      if (changesObj.wizardReady && changesObj.wizardReady.currentValue) {
        ctrl.goTo(ctrl.getEnabledSteps()[0]);
      }

      if (changesObj.currentStep) {
        //checking to make sure currentStep is truthy value
        step = changesObj.currentStep.currentValue;
        if (!step) {
          return;
        }

        //setting stepTitle equal to current step title or default title
        if (ctrl.selectedStep && ctrl.selectedStep.title !== step) {
          ctrl.goTo(stepByTitle(step));
        }
      }
    };

    ctrl.getEnabledSteps = function () {
      return ctrl.steps.filter(function (step) {
        return step.disabled !== 'true';
      });
    };

    ctrl.getReviewSteps = function () {
      return ctrl.steps.filter(function (step) {
        return !step.disabled &&
          (!angular.isUndefined(step.reviewTemplate) || step.getReviewSteps().length > 0);
      });
    };

    ctrl.currentStepNumber = function () {
      //retrieve current step number
      return stepIdx(ctrl.selectedStep) + 1;
    };

    ctrl.getStepNumber = function (step) {
      return stepIdx(step) + 1;
    };

    ctrl.goTo = function (step, resetStepNav) {
      if (ctrl.wizardDone || (ctrl.selectedStep && !ctrl.selectedStep.okToNavAway) || step === ctrl.selectedStep) {
        return;
      }

      if (firstRun || (ctrl.getStepNumber(step) < ctrl.currentStepNumber() && ctrl.selectedStep.isPrevEnabled()) || ctrl.selectedStep.isNextEnabled()) {
        unselectAll();

        if (!firstRun && resetStepNav && step.substeps) {
          step.resetNav();
        }

        ctrl.selectedStep = step;
        step.selected = true;

        $timeout(function () {
          if (angular.isFunction(step.onShow)) {
            step.onShow();
          }
        }, 100);

        // Make sure current step is not undefined
        ctrl.currentStep = step.title;

        //emit event upwards with data on goTo() invocation
        if (!step.substeps) {
          ctrl.setPageSelected(step);
        }
        firstRun = false;
      }

      if (!ctrl.selectedStep.substeps) {
        ctrl.firstStep =  stepIdx(ctrl.selectedStep) === 0;
      } else {
        ctrl.firstStep = stepIdx(ctrl.selectedStep) === 0 && ctrl.selectedStep.currentStepNumber() === 1;
      }
    };

    ctrl.allowStepIndicatorClick = function (step) {
      return step.allowClickNav &&
        !ctrl.wizardDone &&
        ctrl.selectedStep.okToNavAway &&
        (ctrl.selectedStep.nextEnabled || (step.stepPriority < ctrl.selectedStep.stepPriority)) &&
        (ctrl.selectedStep.prevEnabled || (step.stepPriority > ctrl.selectedStep.stepPriority));
    };

    ctrl.stepClick = function (step) {
      if (step.allowClickNav) {
        ctrl.goTo(step, true);
      }
    };

    ctrl.setPageSelected = function (step) {
      if (angular.isFunction(ctrl.onStepChanged)) {
        ctrl.onStepChanged({step: step, index: stepIdx(step)});
      }
    };

    ctrl.addStep = function (step) {
      // Insert the step into step array
      var insertBefore = _.find(ctrl.steps, function (nextStep) {
        return nextStep.stepPriority > step.stepPriority;
      });
      if (insertBefore) {
        ctrl.steps.splice(ctrl.steps.indexOf(insertBefore), 0, step);
      } else {
        ctrl.steps.push(step);
      }

      if (ctrl.wizardReady && (ctrl.getEnabledSteps().length > 0) && (step === ctrl.getEnabledSteps()[0])) {
        ctrl.goTo(ctrl.getEnabledSteps()[0]);
      }
    };

    ctrl.isWizardDone = function () {
      return ctrl.wizardDone;
    };

    ctrl.updateSubStepNumber = function (value) {
      ctrl.firstStep =  stepIdx(ctrl.selectedStep) === 0 && value === 0;
    };

    ctrl.currentStepTitle = function () {
      return ctrl.selectedStep.title;
    };

    ctrl.currentStepDescription = function () {
      return ctrl.selectedStep.description;
    };

    ctrl.currentStep = function () {
      return ctrl.selectedStep;
    };

    ctrl.totalStepCount = function () {
      return ctrl.getEnabledSteps().length;
    };

    // Allow access to any step
    ctrl.goToStep = function (step, resetStepNav) {
      var enabledSteps = ctrl.getEnabledSteps();
      var stepTo;

      if (angular.isNumber(step)) {
        stepTo = enabledSteps[step];
      } else {
        stepTo = stepByTitle(step);
      }

      ctrl.goTo(stepTo, resetStepNav);
    };

    // Method used for next button within step
    ctrl.next = function (callback) {
      var enabledSteps = ctrl.getEnabledSteps();

      // Save the step  you were on when next() was invoked
      var index = stepIdx(ctrl.selectedStep);

      if (ctrl.selectedStep.substeps) {
        if (ctrl.selectedStep.next(callback)) {
          return;
        }
      }

      // Check if callback is a function
      if (angular.isFunction(callback)) {
        if (callback(ctrl.selectedStep)) {
          if (index <= enabledSteps.length - 1) {
            // Go to the next step
            if (enabledSteps[index + 1].substeps) {
              enabledSteps[index + 1].resetNav();
            }
          } else {
            ctrl.finish();
          }
        } else {
          return;
        }
      }

      // Completed property set on ctrl which is used to add class/remove class from progress bar
      ctrl.selectedStep.completed = true;

      // Check to see if this is the last step.  If it is next behaves the same as finish()
      if (index === enabledSteps.length - 1) {
        ctrl.finish();
      } else {
        // Go to the next step
        ctrl.goTo(enabledSteps[index + 1]);
      }
    };

    ctrl.previous = function (callback) {
      var index = stepIdx(ctrl.selectedStep);

      if (ctrl.selectedStep.substeps) {
        if (ctrl.selectedStep.previous(callback)) {
          return;
        }
      }

      // Check if callback is a function
      if (!angular.isFunction(callback) || callback(ctrl.selectedStep)) {

        if (index === 0) {
          throw new Error("Can't go back. It's already in step 0");
        } else {
          ctrl.goTo(ctrl.getEnabledSteps()[index - 1]);
        }
      }
    };

    ctrl.finish = function () {
      if (ctrl.onFinish) {
        if (ctrl.onFinish() !== false) {
          ctrl.reset();
        }
      }
    };

    ctrl.cancel = function () {
      if (ctrl.onCancel) {
        if (ctrl.onCancel() !== false) {
          ctrl.reset();
        }
      }
    };

    //reset
    ctrl.reset = function () {
      //traverse steps array and set each "completed" property to false
      angular.forEach(ctrl.getEnabledSteps(), function (step) {
        step.completed = false;
      });
      //go to first step
      ctrl.goToStep(0);
    };

    // Provide wizard controls to steps and sub-steps
    $scope.wizard = this;
  }]
});
;angular.module('patternfly.canvas').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('canvas-view/canvas-editor/canvas-editor.html',
    "<div class=canvas-editor-container><div class=canvas-editor-toolbar><button id=toggleToolbox class=\"btn btn-primary\" ng-class=\"{'disabled': $ctrl.chartViewModel.inConnectingMode || $ctrl.readOnly}\" type=button ng-click=$ctrl.toggleToolbox() tooltip-placement=bottom-left uib-tooltip=\"{{'Add Item To Canvas'}}\">Add Item <span class=fa ng-class=\"{'fa-angle-double-up': $ctrl.toolboxVisible, 'fa-angle-double-down': !$ctrl.toolboxVisible}\"></span></button><!-- user defined more actions --> <span ng-transclude></span> <span class=right-aligned-controls><input ng-class=\"{'disabled': $ctrl.chartViewModel.inConnectingMode}\" ng-model=$ctrl.hideConnectors ng-change=$ctrl.toggleshowHideConnectors() type=checkbox ng-checked=\"$ctrl.hideConnectors\"> <span class=show-hide-connectors-label>Hide Connectors</span> <a id=zoomOut ng-click=$ctrl.zoomOut() ng-class=\"{'disabled': $ctrl.minZoom()}\"><span class=\"pficon fa fa-minus\" tooltip-append-to-body=true tooltip-placement=bottom uib-tooltip=\"{{'Zoom Out'}}\"></span></a> <a id=zoomIn ng-click=$ctrl.zoomIn() ng-class=\"{'disabled': $ctrl.maxZoom()}\"><span class=\"pficon fa fa-plus\" tooltip-append-to-body=true tooltip-placement=bottom-right uib-tooltip=\"{{'Zoom In'}}\"></span></a></span></div><div class=canvas-editor-toolbox-container><div class=canvas-editor-toolbox id=toolbox ng-if=$ctrl.toolboxVisible><a ng-click=\"$ctrl.toolboxVisible = false\" class=close-toolbox><span class=\"pficon pficon-close\"></span></a><div class=toolbox-filter><input ng-model=$ctrl.searchText id=filterFld class=search-text placeholder=\"{{'Filter by name'}}\"> <a ng-click=\"$ctrl.searchText = ''\"><span class=\"pficon pficon-close clear-search-text\"></span></a></div><uib-tabset><uib-tab ng-repeat=\"tab in $ctrl.toolboxTabs\" heading=\"\" active=tab.active><uib-tab-heading ng-click=$ctrl.tabClicked()><div class=tab-pre-title>{{tab.preTitle}}</div><div class=tab-title ng-class=\"{'tab-single-line':tab.preTitle == null}\">{{tab.title}}</div></uib-tab-heading><uib-tabset class=subtabs ng-if=tab.subtabs><uib-tab ng-repeat=\"subtab in tab.subtabs\" heading={{subtab.title}} active=subtab.active ng-click=$ctrl.tabClicked()><uib-tabset class=subtabs ng-if=subtab.subtabs><uib-tab ng-repeat=\"subsubtab in subtab.subtabs\" heading={{subsubtab.title}} active=subsubtab.active ng-click=$ctrl.tabClicked()><toolbox-items items=subsubtab.items start-drag-callback=$ctrl.startCallback click-callback=$ctrl.addNodeByClick search-text=\"$ctrl.searchText\"></uib-tab></uib-tabset><!-- SubTabs without Sub-Sub Tabs --><toolbox-items ng-if=!subtab.subtabs items=subtab.items start-drag-callback=$ctrl.startCallback click-callback=$ctrl.addNodeByClick search-text=\"$ctrl.searchText\"></uib-tab></uib-tabset><!-- Primary Tabs without SubTabs --><toolbox-items ng-if=!tab.subtabs items=tab.items start-drag-callback=$ctrl.startCallback click-callback=$ctrl.addNodeByClick search-text=\"$ctrl.searchText\"></uib-tab></uib-tabset></div><div class=canvas-container data-drop=true data-jqyoui-options jqyoui-droppable=\"{onDrop:'$ctrl.dropCallback'}\"><pf-canvas chart-data-model=$ctrl.chartDataModel chart-view-model=$ctrl.chartViewModel read-only=$ctrl.readOnly hide-connectors=$ctrl.hideConnectors></pf-canvas></div></div></div>"
  );


  $templateCache.put('canvas-view/canvas-editor/toolbox-items.html',
    "<ul class=toolbox-items-list><li class=toolbox-item ng-repeat=\"item in vm.items | filter:vm.searchText\" data-drag={{!item.disableInToolbox}} jqyoui-draggable=\"{onStart:'vm.startDragCallbackfmDir(item)'}\" ng-class=\"{'not-draggable': item.disableInToolbox}\" data-jqyoui-options=\"{revert: 'invalid', helper: 'clone'}\" ng-click=vm.clickCallbackfmDir(item) uib-tooltip=\"{{(item.disableInToolbox ? 'Items cannot be added to the canvas more than once.' : '')}}\"><img ng-if=item.image src={{item.image}} alt=\"{{item.name}}\"> <i ng-if=\"item.icon && !item.image\" class=\"draggable-item-icon {{item.icon}}\"></i> <span>{{ item.name }}</span></li></ul>"
  );


  $templateCache.put('canvas-view/canvas/canvas.html',
    "<svg class=\"canvas draggable-container\" xmlns=http://www.w3.org/2000/svg ng-mousedown=mouseDown($event) ng-mousemove=mouseMove($event) ng-class=\"{'read-only': readOnly, 'canvas-in-connection-mode': chart.inConnectingMode}\" ng-style=\"{'height': chart.zoom.getChartHeight() + 'px', 'width': chart.zoom.getChartWidth() + 'px', 'background-size': chart.zoom.getBackgroundSize() + 'px '+  chart.zoom.getBackgroundSize() + 'px'}\" mouse-capture><!-- Zoom --><g ng-attr-transform=scale({{zoomLevel()}})><!-- Connection Mode Notification --><g ng-if=chart.inConnectingMode><rect class=connecting-mode-rec ry=1 rx=1 x=0 y=0 width=640 height=32></rect><text class=connecting-mode-label x=12 y=22 ng-if=availableConnections()>Select a second item to complete the connection or click on the canvas to cancel</text><text class=connecting-mode-label-warning x=12 y=22 ng-if=!availableConnections()>No available connections! Click on the canvas to cancel</text></g><!-- Main Node Loop --><g ng-repeat=\"node in chart.nodes\" ng-mousedown=\"nodeMouseDown($event, node)\" ng-mouseover=\"nodeMouseOver($event, node)\" ng-mouseleave=\"nodeMouseLeave($event, node)\" ng-attr-transform=\"translate({{node.x()}}, {{node.y()}})\"><!-- Node --><rect ng-class=\"{'invalid-node-rect': node.invalid(), 'selected-node-rect': node.selected(), 'mouseover-node-rect': node == mouseOverNode, 'node-rect': node != mouseOverNode}\" ry=0 rx=0 x=0 y=0 ng-attr-width={{node.width()}} ng-attr-height={{node.height()}} fill={{node.backgroundColor()}} fill-opacity=1.0></rect><!-- Node Title: no-wrap --><text ng-if=!foreignObjectSupported() class=node-header ng-class=\"{'invalid-node-header': node.invalid()}\" ng-attr-x={{node.width()/2}} ng-attr-y=\"{{node.height() - 24}}\" text-anchor=middle alignment-baseline=middle>{{node.name()}}</text><!-- Node Title: text wrap --><foreignobject ng-if=foreignObjectSupported() x=0 ng-attr-y=\"{{node.height() - 42}}\" ng-attr-width={{node.width()}} ng-attr-height=\"{{node.height() - 42}}\"><body><div class=node-header ng-attr-width={{node.width()}} ng-attr-height=\"{{node.height() - 42}}\"><p ng-class=\"{'invalid-node-header': node.invalid()}\" ng-style=\"{width: node.width()}\">{{node.name()}}</p></div></body></foreignobject><!-- Node Image --><image ng-if=node.image() class=node-center-img ng-class=\"{'invalid-node-img': node.invalid()}\" ng-href=\"{{node.image() | trustAsResourceUrl}}\" xlink:href=\"\" ng-attr-x=\"{{(node.width()/2) - 40}}\" ng-attr-y={{20}} height=80px width=80px></image><!-- Node Icon: icon class --><foreignobject ng-if=\"node.icon() && !node.image() && foreignObjectSupported()\" ng-attr-x=\"{{(node.width()/2) - 44}}\" ng-attr-y=\"{{(node.height()/2) - 54}}\" ng-attr-height={{node.height()}}px ng-attr-width={{node.width()}}px class=node-center-img-icon ng-class=\"{'invalid-node-header': node.invalid()}\"><body><i class={{node.icon()}} ng-style=\"{'font-size': node.fontSize() ? node.fontSize() : '76px'}\"></i></body></foreignobject><!-- Node Icon: fontContent --><text ng-if=\"node.fontFamily() && !node.image()\" class=node-center-icon ng-class=\"{'invalid-node-header': node.invalid()}\" font-family={{node.fontFamily()}} ng-attr-x=\"{{(node.width()/2) - 34 + ((node.bundle()) ? 4 : 0) }}\" ng-attr-y={{90}}>{{node.fontContent()}}</text><!-- Sm. Top Left Bundle Icon --><text ng-if=node.bundle() class=bundle-icon x=6 y=22 font-family=PatternFlyIcons-webfont font-size=20>{{'\\ue918'}}</text><!-- Bottom Node Toolbar --><g id=nodeToolBar ng-if=\"node == mouseOverNode && !chart.inConnectingMode\"><g class=svg-triangle><polyline points=\"4,152 14,140 24,152\"></polyline></g><foreignobject ng-attr-x={{node.x}} ng-attr-y={{node.height()+1}} ng-mousedown=$event.stopPropagation() height=100% width=100%><body><node-toolbar node=node node-actions=chart.nodeActions></node-toolbar></body></foreignobject></g><!-- Connected Input Connectors --><g ng-if=!hideConnectors ng-repeat=\"connector in node.inputConnectors | filter: isConnectorConnected\" ng-mousedown=\"connectorMouseDown($event, node, connector, $index, true)\" ng-mouseover=\"connectorMouseOver($event, node, connector, $index, true)\" ng-mouseleave=\"connectorMouseLeave($event, node, connector, $index, true)\" class=\"connector input-connector\"><circle ng-if=\"!chart.inConnectingMode || isConnectedTo(connector, connectingModeSourceNode)\" ng-class=\"{'mouseover-connector-circle': connector == mouseOverConnector,\n" +
    "                   'connector-circle': connector != mouseOverConnector}\" ng-attr-r={{connectorSize}} ng-attr-cx={{connector.x()}} ng-attr-cy={{connector.y()}}></circle></g><!-- Unconnected Input Connectors --><g ng-if=chart.inConnectingMode ng-repeat=\"connector in node.inputConnectors | filter: isConnectorUnconnectedAndValid\" ng-mousedown=\"connectorMouseDown($event, node, connector, $index, true)\" ng-mouseover=\"connectorMouseOver($event, node, connector, $index, true)\" ng-mouseleave=\"connectorMouseLeave($event, node, connector, $index, true)\" class=\"connector input-connector\"><text ng-if=connector.fontFamily() class=connector-icons font-family={{connector.fontFamily()}} ng-attr-x=\"{{connector.x() - 28}}\" ng-attr-y=\"{{connector.y() + 7}}\">{{connector.fontContent()}}</text><circle ng-class=\"{'unconnected-circle': connector != mouseOverConnector,\n" +
    "                         'mouseover-unconnected-circle': connector == mouseOverConnector}\" ng-attr-r={{connectorSize}} ng-attr-cx={{connector.x()}} ng-attr-cy={{connector.y()}}></circle><g ng-if=\"connector == mouseOverConnector\"><rect class=connector-tooltip ry=1 rx=1 ng-attr-x=\"{{connector.x() - 4}}\" ng-attr-y=\"{{connector.y() + 12}}\" ng-attr-width={{80}} height=20></rect><text class=connector-tooltip-text ng-attr-x=\"{{connector.x() + 2}}\" ng-attr-y=\"{{connector.y() + 26}}\" text-anchor=start alignment-baseline=top>{{connector.name()}}</text></g></g><!-- Output Connector --><g ng-if=!hideConnectors ng-repeat=\"connector in node.outputConnectors\" ng-mousedown=\"connectorMouseDown($event, node, connector, $index, false)\" ng-mouseover=\"connectorMouseOver($event, node, connector, $index, false)\" ng-mouseleave=\"connectorMouseLeave($event, node, connector, $index, false)\" class=\"connector output-connector\"><circle ng-if=\"!chart.inConnectingMode || (connectingModeSourceNode === connector.parentNode())\" ng-class=\"{'connector-circle': connector != mouseOverConnector,\n" +
    "                   'mouseover-connector-circle': connector == mouseOverConnector}\" ng-attr-r={{connectorSize}} ng-attr-r={{connectorSize}} ng-attr-cx={{connector.x()}} ng-attr-cy={{connector.y()}}></circle></g></g><!--  End Nodes Loop --><!-- Connections --><g ng-if=!hideConnectors ng-repeat=\"connection in chart.connections\" class=connection ng-mousedown=\"connectionMouseDown($event, connection)\" ng-mouseover=\"connectionMouseOver($event, connection)\" ng-mouseleave=\"connectionMouseLeave($event, connection)\"><g ng-if=\"!chart.inConnectingMode || connectingModeSourceNode === connection.source.parentNode()\"><path ng-class=\"{'selected-connection-line': connection.selected(),\n" +
    "                     'mouseover-connection-line': connection == mouseOverConnection,\n" +
    "                     'connection-line': connection != mouseOverConnection}\" ng-attr-d=\"M {{connection.sourceCoordX()}}, {{connection.sourceCoordY()}}\n" +
    "                     C {{connection.sourceTangentX()}}, {{connection.sourceTangentY()}}\n" +
    "                       {{connection.destTangentX()}}, {{connection.destTangentY()}}\n" +
    "                       {{connection.destCoordX()}}, {{connection.destCoordY()}}\"></path><text ng-if=\"connection == mouseOverConnection\" ng-class=\"{'selected-connection-name': connection.selected(),\n" +
    "                     'mouseover-connection-name': connection == mouseOverConnection && !connection.selected(),\n" +
    "                     'connection-name': connection != mouseOverConnection && !connection.selected()}\" ng-attr-x={{connection.middleX()}} ng-attr-y={{connection.middleY()}} text-anchor=middle alignment-baseline=middle>{{connection.name()}}</text><circle ng-class=\"{'selected-connection-endpoint': connection.selected(),\n" +
    "                       'mouseover-connection-endpoint': connection == mouseOverConnection && !connection.selected(),\n" +
    "                       'connection-endpoint': connection != mouseOverConnection && !connection.selected()}\" r=5 ng-attr-cx={{connection.sourceCoordX()}} ng-attr-cy={{connection.sourceCoordY()}}></circle><circle ng-class=\"{'selected-connection-endpoint': connection.selected(),\n" +
    "                       'mouseover-connection-endpoint': connection == mouseOverConnection && !connection.selected(),\n" +
    "                       'connection-endpoint': connection != mouseOverConnection && !connection.selected()}\" r=5 ng-attr-cx={{connection.destCoordX()}} ng-attr-cy={{connection.destCoordY()}}></circle></g></g><rect ng-if=dragSelecting class=drag-selection-rect ng-attr-x={{dragSelectionRect.x}} ng-attr-y={{dragSelectionRect.y}} ng-attr-width={{dragSelectionRect.width}} ng-attr-height={{dragSelectionRect.height}}></rect></g></svg>"
  );


  $templateCache.put('canvas-view/canvas/node-toolbar.html',
    "<div class=node-toolbar ng-style=\"{width: vm.node.width()}\"><span ng-repeat=\"nodeAction in vm.nodeActions\" class=\"{{nodeAction.iconClass()}} node-toolbar-icons\" ng-click=actionIconClicked(nodeAction.action())></span></div>"
  );

}]);
;angular.module('patternfly.card').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('card/aggregate-status/aggregate-status-card.html',
    "<div ng-if=!$ctrl.isMiniLayout class=\"card-pf card-pf-aggregate-status\" ng-class=\"{'card-pf-accented': $ctrl.shouldShowTopBorder, 'card-pf-aggregate-status-alt': $ctrl.isAltLayout}\"><h2 class=card-pf-title><a href={{$ctrl.status.href}} ng-if=$ctrl.status.href><image ng-if=$ctrl.status.iconImage ng-src={{$ctrl.status.iconImage}} alt=\"\" class=card-pf-icon-image></image><span class={{$ctrl.status.iconClass}}></span> <span class=card-pf-aggregate-status-count>{{$ctrl.status.count}}</span> <span class=card-pf-aggregate-status-title>{{$ctrl.status.title}}</span></a> <span ng-if=!$ctrl.status.href><image ng-if=$ctrl.status.iconImage ng-src={{$ctrl.status.iconImage}} alt=\"\" class=card-pf-icon-image></image><span class={{$ctrl.status.iconClass}}></span> <span class=card-pf-aggregate-status-count>{{$ctrl.status.count}}</span> <span class=card-pf-aggregate-status-title>{{$ctrl.status.title}}</span></span></h2><div class=card-pf-body><p class=card-pf-aggregate-status-notifications><span class=card-pf-aggregate-status-notification ng-repeat=\"notification in $ctrl.status.notifications\"><a href={{notification.href}} ng-if=notification.href><image ng-if=notification.iconImage ng-src={{notification.iconImage}} alt=\"\" class=card-pf-icon-image></image><span class={{notification.iconClass}}></span>{{ notification.count }}</a> <span ng-if=!notification.href><image ng-if=notification.iconImage ng-src={{notification.iconImage}} alt=\"\" class=card-pf-icon-image></image><span class={{notification.iconClass}}></span>{{ notification.count }}</span></span></p></div></div><div ng-if=$ctrl.isMiniLayout class=\"card-pf card-pf-aggregate-status card-pf-aggregate-status-mini\" ng-class=\"{'card-pf-accented': $ctrl.shouldShowTopBorder}\"><h2 class=card-pf-title><a ng-if=$ctrl.status.href href={{$ctrl.status.href}}><image ng-if=$ctrl.status.iconImage ng-src={{$ctrl.status.iconImage}} alt=\"\" class=card-pf-icon-image></image><span ng-if=$ctrl.status.iconClass class={{$ctrl.status.iconClass}}></span> <span class=card-pf-aggregate-status-count>{{$ctrl.status.count}}</span> {{$ctrl.status.title}}</a> <span ng-if=!$ctrl.status.href><span class=card-pf-aggregate-status-count>{{$ctrl.status.count}}</span> {{$ctrl.status.title}}</span></h2><div class=card-pf-body><p ng-if=\"$ctrl.status.notification.iconImage || $ctrl.status.notification.iconClass || $ctrl.status.notification.count\" class=card-pf-aggregate-status-notifications><span class=card-pf-aggregate-status-notification><a ng-if=$ctrl.status.notification.href href={{$ctrl.status.notification.href}}><image ng-if=$ctrl.status.notification.iconImage ng-src={{$ctrl.status.notification.iconImage}} alt=\"\" class=card-pf-icon-image></image><span ng-if=$ctrl.status.notification.iconClass class={{$ctrl.status.notification.iconClass}}></span><span ng-if=$ctrl.status.notification.count>{{$ctrl.status.notification.count}}</span></a> <span ng-if=!$ctrl.status.notification.href><image ng-if=$ctrl.status.notification.iconImage ng-src={{$ctrl.status.notification.iconImage}} alt=\"\" class=card-pf-icon-image></image><span ng-if=$ctrl.status.notification.iconClass class={{$ctrl.status.notification.iconClass}}></span><span ng-if=$ctrl.status.notification.count>{{$ctrl.status.notification.count}}</span></span></span></p></div></div>"
  );


  $templateCache.put('card/basic/card-filter.html',
    "<div uib-dropdown class=card-pf-time-frame-filter><button type=button uib-dropdown-toggle class=\"btn btn-default\">{{$ctrl.currentFilter.label}} <span class=caret></span></button><ul uib-dropdown-menu class=dropdown-menu-right role=menu><li ng-repeat=\"item in $ctrl.filter.filters\" ng-class=\"{'selected': item === $ctrl.currentFilter}\"><a role=menuitem tabindex=-1 ng-click=$ctrl.filterCallBackFn(item)>{{item.label}}</a></li></ul></div>"
  );


  $templateCache.put('card/basic/card.html',
    "<div ng-class=\"$ctrl.showTopBorder === 'true' ? 'card-pf card-pf-accented' : 'card-pf'\"><div ng-if=$ctrl.showHeader() ng-class=\"$ctrl.shouldShowTitlesSeparator ? 'card-pf-heading' : 'card-pf-heading-no-bottom'\"><div ng-if=$ctrl.showFilterInHeader() ng-include=\"'card/basic/card-filter.html'\"></div><h2 class=card-pf-title>{{$ctrl.headTitle}}</h2></div><span ng-if=$ctrl.subTitle class=card-pf-subtitle>{{$ctrl.subTitle}}</span><div class=card-pf-body><div ng-transclude></div></div><div ng-if=$ctrl.footer class=card-pf-footer><div ng-if=$ctrl.showFilterInFooter() ng-include=\"'card/basic/card-filter.html'\"></div><p><a ng-if=$ctrl.footer.href href={{$ctrl.footer.href}} ng-class=\"{'card-pf-link-with-icon':$ctrl.footer.iconClass,'card-pf-link':!$ctrl.footer.iconClass}\"><span ng-if=$ctrl.footer.iconClass class=\"{{$ctrl.footer.iconClass}} card-pf-footer-text\"></span> <span ng-if=$ctrl.footer.text class=card-pf-footer-text>{{$ctrl.footer.text}}</span></a> <a ng-if=\"$ctrl.footer.callBackFn && !$ctrl.footer.href\" ng-click=$ctrl.footerCallBackFn() ng-class=\"{'card-pf-link-with-icon':$ctrl.footer.iconClass,'card-pf-link':!$ctrl.footer.iconClass}\"><span class=\"{{$ctrl.footer.iconClass}} card-pf-footer-text\" ng-if=$ctrl.footer.iconClass></span> <span class=card-pf-footer-text ng-if=$ctrl.footer.text>{{$ctrl.footer.text}}</span></a> <span ng-if=\"!$ctrl.footer.href && !$ctrl.footer.callBackFn\"><span ng-if=$ctrl.footer.iconClass class=\"{{$ctrl.footer.iconClass}} card-pf-footer-text\" ng-class=\"{'card-pf-link-with-icon':$ctrl.footer.iconClass,'card-pf-link':!$ctrl.footer.iconClass}\"></span> <span ng-if=$ctrl.footer.text class=card-pf-footer-text>{{$ctrl.footer.text}}</span></span></p></div></div>"
  );

}]);
;angular.module('patternfly.charts').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('charts/donut/donut-chart.html',
    "<span><pf-c3-chart ng-if=\"$ctrl.data.dataAvailable !== false\" id={{$ctrl.donutChartId}} config=$ctrl.config get-chart-callback=$ctrl.setChart></pf-c3-chart><pf-empty-chart ng-if=\"$ctrl.data.dataAvailable === false\" chart-height=$ctrl.chartHeight></pf-empty-chart></span>"
  );


  $templateCache.put('charts/donut/donut-pct-chart.html',
    "<span><pf-c3-chart ng-if=\"$ctrl.data.dataAvailable !== false\" id={{$ctrl.donutChartId}} config=$ctrl.config get-chart-callback=$ctrl.setChart></pf-c3-chart><pf-empty-chart ng-if=\"$ctrl.data.dataAvailable === false\" chart-height=$ctrl.chartHeight></pf-empty-chart></span>"
  );


  $templateCache.put('charts/empty-chart.html',
    "<div class=empty-chart-content ng-style=$ctrl.sizeStyles><span class=\"pficon pficon-info\"></span> <span>No data available</span></div>"
  );


  $templateCache.put('charts/heatmap/heatmap-legend.html',
    "<ul class=heatmap-pf-legend-container><li ng-repeat=\"item in $ctrl.legendItems\" class=heatmap-pf-legend-items><span class=legend-pf-color-box ng-style=\"{background: item.color}\"></span> <span class=legend-pf-text>{{item.text}}</span></li></ul>"
  );


  $templateCache.put('charts/heatmap/heatmap.html',
    "<div class=heatmap-pf-container><h3>{{$ctrl.chartTitle}}</h3><div class=heatmap-container ng-style=$ctrl.containerStyles><svg class=heatmap-pf-svg></svg></div><pf-empty-chart ng-if=\"$ctrl.chartDataAvailable === false\" chart-height=$ctrl.height></pf-empty-chart><div ng-if=!$ctrl.loadingDone class=\"spinner spinner-lg loading\"></div><pf-heatmap-legend ng-if=$ctrl.showLegend legend=$ctrl.legendLabels legend-colors=$ctrl.heatmapColorPattern></pf-heatmap-legend></div>"
  );


  $templateCache.put('charts/line/line-chart.html',
    "<span><pf-c3-chart id={{$ctrl.lineChartId}} ng-if=\"$ctrl.chartData.dataAvailable !== false\" config=$ctrl.chartConfig></pf-c3-chart><pf-empty-chart ng-if=\"$ctrl.chartData.dataAvailable === false\" chart-height=$ctrl.chartConfig.size.height></pf-empty-chart></span>"
  );


  $templateCache.put('charts/sparkline/sparkline-chart.html',
    "<span><pf-c3-chart ng-if=\"$ctrl.chartData.dataAvailable !== false\" id={{$ctrl.sparklineChartId}} config=$ctrl.chartConfig></pf-c3-chart><pf-empty-chart ng-if=\"$ctrl.chartData.dataAvailable === false\" chart-height=$ctrl.chartHeight></pf-empty-chart></span>"
  );


  $templateCache.put('charts/trends/trends-chart.html',
    "<span ng-switch on=$ctrl.config.layout ng-class=\"{'data-unavailable-pf': $ctrl.chartData.dataAvailable === false}\"><div ng-switch-default ng-class=\"{'trend-card-large-pf': $ctrl.showLargeCardLayout,'trend-card-small-pf': $ctrl.showSmallCardLayout}\"><span class=trend-header-pf ng-if=$ctrl.config.title>{{$ctrl.config.title}}</span> <span ng-if=$ctrl.showActualValue><span class=trend-title-big-pf>{{$ctrl.getLatestValue()}}</span> <span class=trend-title-small-pf>{{$ctrl.config.units}}</span></span> <span ng-if=$ctrl.showPercentageValue><span class=trend-title-big-pf>{{$ctrl.getPercentageValue() + '%'}}</span> <span class=trend-title-small-pf>of {{$ctrl.chartData.total + ' ' + $ctrl.config.units}}</span></span><pf-sparkline-chart ng-if=\"$ctrl.chartData.dataAvailable !== false\" config=$ctrl.config chart-data=$ctrl.chartData chart-height=$ctrl.getChartHeight() show-x-axis=$ctrl.showXAxis show-y-axis=$ctrl.showYAxis></pf-sparkline-chart><pf-empty-chart ng-if=\"$ctrl.chartData.dataAvailable === false\" chart-height=$ctrl.getChartHeight()></pf-empty-chart><span class=trend-footer-pf ng-if=$ctrl.config.timeFrame>{{$ctrl.config.timeFrame}}</span></div><div ng-switch-when=compact class=trend-card-compact-pf><div class=\"row trend-row\"><div class=\"col-sm-4 col-md-4\"><div class=trend-compact-details><span ng-if=$ctrl.showActualValue><span class=trend-title-compact-big-pf>{{$ctrl.getLatestValue()}}</span> <span class=trend-title-compact-small-pf>{{$ctrl.config.units}}</span></span> <span ng-if=$ctrl.showPercentageValue><span class=trend-title-compact-big-pf>{{$ctrl.getPercentageValue() + '%'}}</span> <span class=trend-title-compact-small-pf>of {{$ctrl.chartData.total + ' ' + $ctrl.config.units}}</span></span> <span class=trend-header-compact-pf ng-if=$ctrl.config.title>{{$ctrl.config.title}}</span></div></div><div class=\"col-sm-8 col-md-8\"><pf-sparkline-chart ng-if=\"$ctrl.chartData.dataAvailable !== false\" config=$ctrl.config chart-data=$ctrl.chartData chart-height=$ctrl.getChartHeight() show-x-axis=$ctrl.showXAxis show-y-axis=$ctrl.showYAxis></pf-sparkline-chart><pf-empty-chart ng-if=\"$ctrl.chartData.dataAvailable === false\" chart-height=$ctrl.getChartHeight()></pf-empty-chart></div></div></div><div ng-switch-when=inline class=trend-card-inline-pf><div class=\"row trend-row\"><div class=\"col-sm-8 col-md-8 trend-flat-col\"><pf-sparkline-chart ng-if=\"$ctrl.chartData.dataAvailable !== false\" config=$ctrl.config chart-data=$ctrl.chartData chart-height=$ctrl.getChartHeight() show-x-axis=$ctrl.showXAxis show-y-axis=$ctrl.showYAxis></pf-sparkline-chart><pf-empty-chart ng-if=\"$ctrl.chartData.dataAvailable === false\" chart-height=$ctrl.getChartHeight()></pf-empty-chart></div><div class=\"col-sm-4 col-md-4 trend-flat-col\"><div class=trend-flat-details><div class=trend-flat-details-cell><span class=trend-title-flat-big-pf>{{$ctrl.getPercentageValue() + '%'}}</span></div><div class=trend-flat-details-cell><span class=trend-label-flat-strong-pf>{{$ctrl.config.trendLabel}}</span> <span class=trend-label-flat-pf>{{$ctrl.getLatestValue()}} of {{$ctrl.chartData.total + ' ' + $ctrl.config.units}}</span></div></div></div></div></div></span>"
  );


  $templateCache.put('charts/utilization-bar/utilization-bar-chart.html',
    "<div class=utilization-bar-chart-pf ng-class=\"{'data-unavailable-pf': $ctrl.chartData.dataAvailable === false}\"><span ng-if=\"!$ctrl.layout || $ctrl.layout.type === 'regular'\"><div ng-if=$ctrl.chartTitle class=progress-description>{{$ctrl.chartTitle}}</div><div class=\"progress progress-label-top-right\" ng-if=\"$ctrl.chartData.dataAvailable !== false\"><div class=progress-bar aria-valuenow={{$ctrl.chartData.percentageUsed}} aria-valuemin=0 aria-valuemax=100 ng-class=\"{'animate': animate,\n" +
    "           'progress-bar-success': $ctrl.isOk, 'progress-bar-danger': $ctrl.isError, 'progress-bar-warning': $ctrl.isWarn}\" ng-style=\"{width:$ctrl.chartData.percentageUsed + '%'}\" uib-tooltip=\"{{$ctrl.chartData.percentageUsed}}% Used\"><span ng-if=$ctrl.chartFooter ng-bind-html=$ctrl.chartFooter></span> <span ng-if=\"!$ctrl.chartFooter && (!$ctrl.footerLabelFormat || $ctrl.footerLabelFormat === 'actual')\"><strong>{{$ctrl.chartData.used}} of {{$ctrl.chartData.total}} {{$ctrl.units}}</strong> Used</span> <span ng-if=\"!$ctrl.chartFooter && $ctrl.footerLabelFormat === 'percent'\"><strong>{{$ctrl.chartData.percentageUsed}}%</strong> Used</span></div><div class=\"progress-bar progress-bar-remaining\" ng-style=\"{width:(100 - $ctrl.chartData.percentageUsed) + '%'}\" uib-tooltip=\"{{100 - $ctrl.chartData.percentageUsed}}% Available\"></div></div></span> <span ng-if=\"$ctrl.layout && $ctrl.layout.type === 'inline'\"><div class=\"progress-container progress-description-left progress-label-right\" ng-style=\"{'padding-left':$ctrl.layout.titleLabelWidth, 'padding-right':$ctrl.layout.footerLabelWidth}\"><div ng-if=$ctrl.chartTitle class=progress-description ng-style=\"{'max-width':$ctrl.layout.titleLabelWidth}\">{{$ctrl.chartTitle}}</div><div class=progress ng-if=\"$ctrl.chartData.dataAvailable !== false\"><div class=progress-bar aria-valuenow={{$ctrl.chartData.percentageUsed}} aria-valuemin=0 aria-valuemax=100 ng-class=\"{'animate': $ctrl.animate, 'progress-bar-success': $ctrl.isOk, 'progress-bar-danger': $ctrl.isError, 'progress-bar-warning': $ctrl.isWarn}\" ng-style=\"{width:$ctrl.chartData.percentageUsed + '%'}\" uib-tooltip=\"{{$ctrl.chartData.percentageUsed}}% Used\"><span ng-if=$ctrl.chartFooter ng-bind-html=$ctrl.chartFooter></span> <span ng-if=\"(!$ctrl.chartFooter) && (!$ctrl.footerLabelFormat || $ctrl.footerLabelFormat === 'actual')\" ng-style=\"{'max-width':$ctrl.layout.footerLabelWidth}\"><strong>{{$ctrl.chartData.used}} {{$ctrl.units}}</strong> Used</span> <span ng-if=\"(!$ctrl.chartFooter) && $ctrl.footerLabelFormat === 'percent'\" ng-style=\"{'max-width':$ctrl.layout.footerLabelWidth}\"><strong>{{$ctrl.chartData.percentageUsed}}%</strong> Used</span></div><div class=\"progress-bar progress-bar-remaining\" ng-style=\"{width:(100 - $ctrl.chartData.percentageUsed) + '%'}\" uib-tooltip=\"{{100 - $ctrl.chartData.percentageUsed}}% Available\"></div></div></div></span><pf-empty-chart ng-if=\"$ctrl.chartData.dataAvailable === false\" chart-height=45></pf-empty-chart></div>"
  );


  $templateCache.put('charts/utilization-trend/utilization-trend-chart.html',
    "<div class=utilization-trend-chart-pf ng-class=\"{'data-unavailable-pf': $ctrl.chartData.dataAvailable === false}\"><h3>{{$ctrl.config.title}}</h3><div class=current-values><h1 class=\"available-count pull-left\">{{$ctrl.currentValue}}</h1><div class=\"available-text pull-left\"><div><span>{{$ctrl.currentText}}</span></div><div><span>of {{$ctrl.chartData.total}} {{$ctrl.config.units}}</span></div></div></div><div class=donut-chart-pf><pf-donut-pct-chart ng-if=\"$ctrl.chartData.dataAvailable !== false\" config=$ctrl.donutConfig data=$ctrl.chartData center-label=$ctrl.centerLabel></pf-donut-pct-chart><pf-empty-chart ng-if=\"$ctrl.chartData.dataAvailable === false\" chart-height=231></pf-empty-chart></div><div ng-if=\"$ctrl.chartData.dataAvailable !== false\" class=sparkline-chart><pf-sparkline-chart config=$ctrl.sparklineConfig chart-data=$ctrl.chartData chart-height=$ctrl.sparklineChartHeight show-x-axis=$ctrl.showSparklineXAxis show-y-axis=$ctrl.showSparklineYAxis></pf-sparkline-chart></div><span class=\"pull-left legend-text\">{{$ctrl.legendLeftText}}</span> <span class=\"pull-right legend-text\">{{$ctrl.legendRightText}}</span></div>"
  );

}]);
;angular.module('patternfly.filters').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('filters/filter-fields.html',
    "<div class=\"filter-pf filter-fields\"><div class=\"input-group form-group\"><div uib-dropdown class=input-group-btn><button uib-dropdown-toggle type=button class=\"btn btn-default filter-fields\" uib-tooltip=\"Filter by\" tooltip-placement=top tooltip-append-to-body=true>{{$ctrl.currentField.title}} <span class=caret></span></button><ul uib-dropdown-menu><li ng-repeat=\"item in $ctrl.config.fields\"><a class=filter-field role=menuitem tabindex=-1 ng-click=$ctrl.selectField(item)>{{item.title}}</a></li></ul></div><div ng-if=\"$ctrl.currentField.filterType !== 'select'\"><input class=form-control type={{$ctrl.currentField.filterType}} ng-model=$ctrl.currentValue placeholder={{$ctrl.currentField.placeholder}} ng-keypress=\"$ctrl.onValueKeyPress($event)\"></div><div ng-if=\"$ctrl.currentField.filterType === 'select'\"><div class=\"btn-group bootstrap-select form-control filter-select\" uib-dropdown><button type=button uib-dropdown-toggle class=\"btn btn-default dropdown-toggle\"><span class=\"filter-option pull-left\">{{$ctrl.currentValue || $ctrl.currentField.placeholder}}</span> <span class=caret></span></button><ul uib-dropdown-menu class=dropdown-menu-right role=menu><li ng-if=$ctrl.currentField.placeholder><a role=menuitem tabindex=-1 ng-click=$ctrl.selectValue()>{{$ctrl.currentField.placeholder}}</a></li><li ng-repeat=\"filterValue in $ctrl.currentField.filterValues\" ng-class=\"{'selected': filterValue === $ctrl.currentValue}\"><a role=menuitem tabindex=-1 ng-click=$ctrl.selectValue(filterValue)>{{filterValue}}</a></li></ul></div></div></div></div>"
  );


  $templateCache.put('filters/filter-results.html',
    "<div class=filter-pf><div class=\"row toolbar-pf-results\"><div class=col-sm-12><h5>{{$ctrl.config.resultsCount}} Results</h5><p ng-if=\"$ctrl.config.appliedFilters.length > 0\">Active filters:</p><ul class=list-inline><li ng-repeat=\"filter in $ctrl.config.appliedFilters\"><span class=\"active-filter label label-info\">{{filter.title}}: {{filter.value}} <a><span class=\"pficon pficon-close\" ng-click=$ctrl.clearFilter(filter)></span></a></span></li></ul><p><a class=clear-filters ng-click=$ctrl.clearAllFilters() ng-if=\"$ctrl.config.appliedFilters.length > 0\">Clear All Filters</a></p><div ng-if=\"$ctrl.config.selectedCount !== undefined && $ctrl.config.totalCount !== undefined\" class=pf-table-view-selected-label><strong>{{$ctrl.config.selectedCount}}</strong> of <strong>{{$ctrl.config.totalCount}}</strong> selected</div></div><!-- /col --></div><!-- /row --></div>"
  );


  $templateCache.put('filters/filter.html',
    "<div class=filter-pf><pf-filter-fields config=$ctrl.config add-filter-fn=$ctrl.addFilter></pf-filter-fields><pf-filter-results config=$ctrl.config></pf-filter-results></div>"
  );

}]);
;angular.module('patternfly.form').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('form/form-buttons/form-buttons.html',
    "<div class=form-group><div class={{$ctrl.pfButtonContainerClass}}><div class=\"control-group buttons\"><button class=\"btn btn-default\" type=button ng-click=$ctrl.pfHandleCancel() ng-disabled=$ctrl.pfWorking translate>Cancel</button> <button class=\"btn btn-primary\" ng-click=\"$ctrl.pfHandleSave(); $ctrl.pfWorking = true\" ng-disabled=\"$ctrl.isInvalid() || $ctrl.pfWorking\"><i class=\"icon-spinner icon-spin\" ng-show=$ctrl.pfWorking></i> <span ng-show=$ctrl.pfWorking translate>Saving...</span> <span ng-hide=$ctrl.pfWorking translate>Save</span></button></div></div></div>"
  );


  $templateCache.put('form/form-group/form-group.html',
    "<div class=form-group ng-class=\"{ 'has-error' : $ctrl.hasErrors() }\"><label for=\"{{ $ctrl.pfField }}\" class=\"control-label {{ $ctrl.pfLabelClass }}\">{{ $ctrl.pfLabel }}</label><div class=\"{{ $ctrl.pfInputClass }}\"><span ng-transclude></span> <span class=help-block ng-show=$ctrl.error.messages><ul><li ng-repeat=\"message in $ctrl.error.messages\">{{ message }}</li></ul></span></div></div>"
  );

}]);
;angular.module('patternfly.modals').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('modals/about-modal.html',
    "<script type=text/ng-template id=about-modal-template.html><div class=\"about-modal-pf\">\n" +
    "    <div class=\"modal-header\">\n" +
    "      <button type=\"button\" class=\"close\" ng-click=\"$ctrl.close()\" aria-hidden=\"true\">\n" +
    "        <span class=\"pficon pficon-close\"></span>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "      <h1 ng-if=\"$ctrl.title\">{{$ctrl.title}}</h1>\n" +
    "      <div ng-if=\"$ctrl.productInfo && $ctrl.productInfo.length > 0\" class=\"product-versions-pf\">\n" +
    "        <ul class=\"list-unstyled\">\n" +
    "          <li ng-repeat=\"info in $ctrl.productInfo\"><strong>{{info.name}}</strong> {{info.value}}</li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "      <div pf-about-modal-transclude=\"$ctrl.template\" class=\"product-versions-pf\"></div>\n" +
    "      <div ng-if=\"$ctrl.additionalInfo\" class=\"product-versions-pf\">{{$ctrl.additionalInfo}}</div>\n" +
    "      <div ng-if=\"$ctrl.copyright\" class=\"trademark-pf\">{{$ctrl.copyright}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "      <img ng-if=\"$ctrl.imgSrc\" ng-src=\"{{$ctrl.imgSrc}}\" alt=\"{{$ctrl.imgAlt}}\"/>\n" +
    "    </div>\n" +
    "  </div></script>"
  );

}]);
;angular.module('patternfly.navigation').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('navigation/application-launcher.html',
    "<div><div class=\"applauncher-pf dropdown dropdown-kebab-pf\" ng-class=\"{'applauncher-pf-block-list': !$ctrl.isList}\" uib-dropdown uib-keyboard-nav=true><a id=domain-switcher-{{$ctrl.$id}} class=\"dropdown-toggle drawer-pf-trigger-icon\" uib-dropdown-toggle ng-class=\"{'disabled': $ctrl.isDisabled || !$ctrl.items.length}\" href><i class=\"fa fa-th applauncher-pf-icon\" aria-hidden=true></i> <span class=applauncher-pf-title>{{$ctrl.label || 'Application Launcher'}} <span class=caret aria-hidden=true></span></span></a><ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=menu aria-labelledby=domain-switcher-{{$ctrl.$id}}><li class=applauncher-pf-item role=menuitem ng-repeat=\"item in $ctrl.items\"><a class=applauncher-pf-link ng-href={{item.href}} target=\"{{item.target || '_blank'}}\" title={{item.tooltip}}><i class=\"applauncher-pf-link-icon pficon\" ng-class=item.iconClass ng-if=!$ctrl.hiddenIcons aria-hidden=true></i> <span class=applauncher-pf-link-title>{{item.title}}</span></a></li></ul></div></div>"
  );


  $templateCache.put('navigation/vertical-navigation.html',
    "<div><nav class=\"navbar navbar-pf-vertical\"><div class=navbar-header><button type=button class=navbar-toggle ng-click=$ctrl.handleNavBarToggleClick()><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <span class=navbar-brand><img class=navbar-brand-icon ng-if=$ctrl.brandSrc ng-src={{$ctrl.brandSrc}} alt=\"{{$ctrl.brandAlt}}\"> <span class=navbar-brand-txt ng-if=!$ctrl.brandSrc>{{$ctrl.brandAlt}}</span></span></div><nav class=\"collapse navbar-collapse\" ng-transclude></nav><div class=nav-pf-vertical ng-class=\"{'nav-pf-persistent-secondary': $ctrl.persistentSecondary,\n" +
    "                    'nav-pf-vertical-collapsible-menus': $ctrl.pinnableMenus,\n" +
    "                    'hidden-icons-pf': $ctrl.hiddenIcons,\n" +
    "                    'nav-pf-vertical-with-badges': $ctrl.showBadges,\n" +
    "                    'secondary-visible-pf': $ctrl.activeSecondary,\n" +
    "                    'show-mobile-secondary': $ctrl.showMobileSecondary,\n" +
    "                    'show-mobile-tertiary': $ctrl.showMobileTertiary,\n" +
    "                    'hover-secondary-nav-pf': $ctrl.hoverSecondaryNav,\n" +
    "                    'hover-tertiary-nav-pf': $ctrl.hoverTertiaryNav,\n" +
    "                    'collapsed-secondary-nav-pf': $ctrl.collapsedSecondaryNav,\n" +
    "                    'collapsed-tertiary-nav-pf': $ctrl.collapsedTertiaryNav,\n" +
    "                    'hidden': $ctrl.inMobileState,\n" +
    "                    'collapsed': $ctrl.navCollapsed,\n" +
    "                    'force-hide-secondary-nav-pf': $ctrl.forceHidden,\n" +
    "                    'show-mobile-nav': $ctrl.showMobileNav}\"><ul class=list-group><li ng-repeat=\"item in $ctrl.items\" class=list-group-item ng-class=\"{'secondary-nav-item-pf': item.children && item.children.length > 0,\n" +
    "                       'active': item.isActive,\n" +
    "                       'is-hover': item.isHover,\n" +
    "                       'mobile-nav-item-pf': item.isMobileItem && $ctrl.showMobileSecondary,\n" +
    "                       'mobile-secondary-item-pf': item.isMobileItem && $ctrl.showMobileTertiary}\" ng-mouseenter=$ctrl.handlePrimaryHover(item) ng-mouseleave=$ctrl.handlePrimaryUnHover(item)><a ng-click=\"$ctrl.handlePrimaryClick(item, $event)\"><span class={{item.iconClass}} ng-if=item.iconClass ng-class=\"{hidden: $ctrl.hiddenIcons}\" uib-tooltip={{item.title}} tooltip-append-to-body=true tooltip-enable={{$ctrl.navCollapsed}} tooltip-placement=bottom tooltip-class=nav-pf-vertical-tooltip></span> <span class=list-group-item-value>{{item.title}}</span><div ng-if=\"$ctrl.showBadges && item.badges\" class=badge-container-pf><div class=\"badge {{badge.badgeClass}}\" ng-repeat=\"badge in item.badges\" uib-tooltip={{badge.tooltip}} tooltip-append-to-body=true tooltip-placement=right><span ng-if=\"badge.count && badge.iconClass\" class={{badge.iconClass}}></span> <span ng-if=badge.count>{{badge.count}}</span></div></div></a><div ng-if=\"item.children && item.children.length > 0\" class=nav-pf-secondary-nav><div class=nav-item-pf-header><a class=secondary-collapse-toggle-pf ng-click=\"$ctrl.collapseSecondaryNav(item, $event)\" ng-class=\"{'collapsed': item.secondaryCollapsed}\"></a> <span>{{item.title}}</span></div><ul class=list-group><li ng-repeat=\"secondaryItem in item.children\" class=list-group-item ng-class=\"{'tertiary-nav-item-pf': secondaryItem.children && secondaryItem.children.length > 0,\n" +
    "                             'active': secondaryItem.isActive,\n" +
    "                             'is-hover': secondaryItem.isHover,\n" +
    "                             'mobile-nav-item-pf': secondaryItem.isMobileItem}\" ng-mouseenter=$ctrl.handleSecondaryHover(secondaryItem) ng-mouseleave=$ctrl.handleSecondaryUnHover(secondaryItem)><a ng-click=\"$ctrl.handleSecondaryClick(item, secondaryItem, $event)\"><span class=list-group-item-value>{{secondaryItem.title}}</span><div ng-if=\"showBadges && secondaryItem.badges\" class=badge-container-pf><div class=\"badge {{badge.badgeClass}}\" ng-repeat=\"badge in secondaryItem.badges\" uib-tooltip={{badge.tooltip}} tooltip-append-to-body=true tooltip-placement=right><span ng-if=\"badge.count && badge.iconClass\" class={{badge.iconClass}}></span> <span ng-if=badge.count>{{badge.count}}</span></div></div></a><div ng-if=\"secondaryItem.children && secondaryItem.children.length > 0\" class=nav-pf-tertiary-nav><div class=nav-item-pf-header><a class=tertiary-collapse-toggle-pf ng-click=\"$ctrl.collapseTertiaryNav(secondaryItem, $event)\" ng-class=\"{'collapsed': secondaryItem.tertiaryCollapsed}\"></a> <span>{{secondaryItem.title}}</span></div><ul class=list-group><li ng-repeat=\"tertiaryItem in secondaryItem.children\" class=list-group-item ng-class=\"{'active': tertiaryItem.isActive}\"><a ng-click=\"$ctrl.handleTertiaryClick(item, secondaryItem, tertiaryItem, $event)\"><span class=list-group-item-value>{{tertiaryItem.title}}</span><div ng-if=\"$ctrl.showBadges && tertiaryItem.badges\" class=badge-container-pf><div class=\"badge {{badge.badgeClass}}\" ng-repeat=\"badge in tertiaryItem.badges\" uib-tooltip={{badge.tooltip}} tooltip-append-to-body=true tooltip-placement=right><span ng-if=\"badge.count && badge.iconClass\" class={{badge.iconClass}}></span> <span ng-if=badge.count>{{badge.count}}</span></div></div></a></li></ul></div></li></ul></div></li></ul></div></nav></div>"
  );

}]);
;angular.module('patternfly.notification').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('notification/inline-notification.html',
    "<div class=\"alert alert-{{$ctrl.pfNotificationType}}\" ng-class=\"{'alert-dismissable': $ctrl.pfNotificationPersistent === true}\"><button ng-show=$ctrl.pfNotificationPersistent ng-click=$ctrl.pfNotificationRemove() type=button class=close data-dismiss=alert aria-hidden=true><span class=\"pficon pficon-close\"></span></button> <span class=\"pficon pficon-ok\" ng-show=\"$ctrl.pfNotificationType === 'success'\"></span> <span class=\"pficon pficon-info\" ng-show=\"$ctrl.pfNotificationType === 'info'\"></span> <span class=\"pficon pficon-error-circle-o\" ng-show=\"$ctrl.pfNotificationType === 'danger'\"></span> <span class=\"pficon pficon-warning-triangle-o\" ng-show=\"$ctrl.pfNotificationType === 'warning'\"></span> <strong>{{$ctrl.pfNotificationHeader}}</strong> {{$ctrl.pfNotificationMessage}}</div>"
  );


  $templateCache.put('notification/notification-drawer.html',
    "<div class=drawer-pf ng-class=\"{'hide': $ctrl.drawerHidden, 'drawer-pf-expanded': $ctrl.drawerExpanded}\"><div ng-if=$ctrl.drawerTitle class=drawer-pf-title><a ng-if=$ctrl.allowExpand class=drawer-pf-toggle-expand ng-click=$ctrl.toggleExpandDrawer()></a><h3 class=text-center>{{$ctrl.drawerTitle}}</h3></div><div ng-if=$ctrl.titleInclude class=drawer-pf-title ng-include src=$ctrl.titleInclude></div><div pf-fixed-accordion scroll-selector=.panel-body><div class=panel-group><div class=\"panel panel-default\" ng-repeat=\"notificationGroup in $ctrl.notificationGroups track by $index\"><div class=panel-heading><h4 class=panel-title><a ng-click=$ctrl.toggleCollapse(notificationGroup) ng-class=\"{collapsed: !notificationGroup.open}\" ng-include src=$ctrl.headingInclude></a></h4><span class=panel-counter ng-include src=$ctrl.subheadingInclude></span></div><div class=\"panel-collapse collapse\" ng-class=\"{in: notificationGroup.open}\"><div class=panel-body><div class=drawer-pf-notification ng-class=\"{unread: notification.unread, 'expanded-notification': $ctrl.drawerExpanded}\" ng-repeat=\"notification in notificationGroup.notifications\" ng-include src=$ctrl.notificationBodyInclude></div><div ng-if=notificationGroup.isLoading class=\"drawer-pf-loading text-center\"><span class=\"spinner spinner-xs spinner-inline\"></span> Loading More</div></div><div class=drawer-pf-action ng-if=$ctrl.actionButtonTitle><a class=\"btn btn-link btn-block\" ng-click=$ctrl.actionButtonCallback(notificationGroup)>{{$ctrl.actionButtonTitle}}</a></div><div ng-if=$ctrl.notificationFooterInclude ng-include src=$ctrl.notificationFooterInclude></div></div></div></div></div></div>"
  );


  $templateCache.put('notification/notification-list.html',
    "<div data-ng-show=\"$ctrl.notifications.data.length > 0\"><div ng-repeat=\"notification in $ctrl.notifications.data\"><pf-inline-notification pf-notification-type=notification.type pf-notification-header=notification.header pf-notification-message=notification.message pf-notification-persistent=notification.isPersistent pf-notification-index=$index></pf-inline-notification></div></div>"
  );


  $templateCache.put('notification/toast-notification-list.html',
    "<div class=toast-notifications-list-pf data-ng-show=\"$ctrl.notifications.length > 0\"><div ng-repeat=\"notification in $ctrl.notifications\"><pf-toast-notification notification-type={{notification.type}} header={{notification.header}} message={{notification.message}} show-close=\"{{($ctrl.showClose || notification.isPersistent === true) && !(notification.menuActions && notification.menuActions.length > 0)}}\" close-callback=$ctrl.handleClose action-title={{notification.actionTitle}} action-callback=notification.actionCallback menu-actions=notification.menuActions update-viewing=$ctrl.handleViewingChange data=notification></pf-toast-notification></div></div>"
  );


  $templateCache.put('notification/toast-notification.html',
    "<div class=\"toast-pf alert alert-{{$ctrl.notificationType}}\" ng-class=\"{'alert-dismissable': $ctrl.showCloseButton}\" ng-mouseenter=$ctrl.handleEnter() ng-mouseleave=$ctrl.handleLeave()><div uib-dropdown class=\"pull-right dropdown-kebab-pf\" ng-if=\"$ctrl.menuActions && $ctrl.menuActions.length > 0\"><button uib-dropdown-toggle class=\"btn btn-link\" type=button id=dropdownKebabRight><span class=\"fa fa-ellipsis-v\"></span></button><ul uib-dropdown-menu class=dropdown-menu-right aria-labelledby=dropdownKebabRight><li ng-repeat=\"menuAction in $ctrl.menuActions\" role=\"{{menuAction.isSeparator === true ? 'separator' : 'menuitem'}}\" ng-class=\"{'divider': menuAction.isSeparator === true, 'disabled': menuAction.isDisabled === true}\"><a ng-if=\"menuAction.isSeparator !== true\" class=secondary-action title={{menuAction.title}} ng-click=$ctrl.handleMenuAction(menuAction)>{{menuAction.name}}</a></li></ul></div><button ng-if=$ctrl.showCloseButton type=button class=close aria-hidden=true ng-click=$ctrl.handleClose()><span class=\"pficon pficon-close\"></span></button><div class=\"pull-right toast-pf-action\" ng-if=$ctrl.actionTitle><a ng-click=$ctrl.handleAction()>{{$ctrl.actionTitle}}</a></div><span class=\"pficon pficon-ok\" ng-if=\"$ctrl.notificationType === 'success'\"></span> <span class=\"pficon pficon-info\" ng-if=\"$ctrl.notificationType === 'info'\"></span> <span class=\"pficon pficon-error-circle-o\" ng-if=\"$ctrl.notificationType === 'danger'\"></span> <span class=\"pficon pficon-warning-triangle-o\" ng-if=\"$ctrl.notificationType === 'warning'\"></span> <span ng-if=$ctrl.header><strong>{{$ctrl.header}}</strong> {{$ctrl.message}}</span> <span ng-if=!$ctrl.header>{{$ctrl.message}}</span></div>"
  );

}]);
;angular.module('patternfly.select').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('select/select.html',
    "<div uib-dropdown class=btn-group><button uib-dropdown-toggle type=button class=\"btn btn-default\">{{$ctrl.getDisplayValue($ctrl.selected || $ctrl.emptyValue)}} <span class=caret></span></button><ul uib-dropdown-menu><li ng-if=$ctrl.emptyValue ng-class=\"{'selected': !$ctrl.selected}\"><a href=javascript:void(0); role=menuitem tabindex=-1 ng-click=$ctrl.selectItem()>{{$ctrl.emptyValue}}</a></li><li ng-repeat=\"item in $ctrl.options\" ng-class=\"{'selected': item === $ctrl.selected}\"><a href=javascript:void(0); role=menuitem tabindex=-1 ng-click=$ctrl.selectItem(item)>{{$ctrl.getDisplayValue(item)}}</a></li></ul></div>"
  );

}]);
;angular.module('patternfly.sort').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('sort/sort.html',
    "<div class=sort-pf><div uib-dropdown class=btn-group><button uib-dropdown-toggle type=button class=\"btn btn-default\">{{$ctrl.config.currentField.title}} <span class=caret></span></button><ul uib-dropdown-menu><li ng-repeat=\"item in $ctrl.config.fields\" ng-class=\"{'selected': item === $ctrl.config.currentField}\"><a href=javascript:void(0); class=sort-field role=menuitem tabindex=-1 ng-click=$ctrl.selectField(item)>{{item.title}}</a></li></ul></div><button class=\"btn btn-link\" type=button ng-click=$ctrl.changeDirection()><span class=sort-direction ng-class=$ctrl.getSortIconClass()></span></button></div>"
  );

}]);
;angular.module('patternfly.table').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('table/tableview/table-view.html',
    "<div class=container-fluid><table ng-if=\"$ctrl.config.itemsAvailable !== false\" datatable=ng dt-options=$ctrl.dtOptions dt-column-defs=$ctrl.dtColumnDefs dt-instance=$ctrl.dtInstanceCallback class=\"table-view-container table table-striped table-bordered table-hover dataTable\"><thead><tr role=row><th class=table-view-pf-select><input type=checkbox value=$ctrl.selectAll ng-model=$ctrl.selectAll ng-change=\"$ctrl.toggleAll()\"></th><th ng-repeat=\"col in $ctrl.colummns\">{{col.header}}</th><th ng-if=$ctrl.areActions() colspan={{$ctrl.calcActionsColspan()}}>Actions</th></tr></thead><tbody><tr role=row ng-repeat=\"item in $ctrl.items track by $index\"><td class=table-view-pf-select><input type=checkbox value=item.selected ng-model=item.selected ng-change=\"$ctrl.toggleOne(item)\"></td><td ng-repeat=\"(key, value) in item\" ng-if=$ctrl.isColItemFld(key)>{{ value }}</td><td ng-if=\"$ctrl.actionButtons && $ctrl.actionButtons.length > 0\" class=table-view-pf-actions ng-repeat=\"actionButton in $ctrl.actionButtons\"><div class=table-view-pf-btn><button class=\"btn btn-default\" title={{actionButton.title}} ng-click=\"$ctrl.handleButtonAction(actionButton, item)\"><span ng-if=!actionButton.include>{{actionButton.name}}</span></button></div></td><td ng-if=\"$ctrl.menuActions && $ctrl.menuActions.length > 0\" class=\"table-view-pf-actions list-group-item-header\"><div uib-dropdown class=\"{{$ctrl.dropdownClass}} dropdown-kebab-pf\" id=kebab_{{$index}} ng-if=\"$ctrl.menuActions && $ctrl.menuActions.length > 0\"><button uib-dropdown-toggle class=\"btn btn-default dropdown-toggle\" type=button id=dropdownKebabRight_{{$index}} ng-click=\"$ctrl.setupActions(item, $event)\"><span class=\"fa fa-ellipsis-v\"></span></button><ul uib-dropdown-menu class=\"dropdown-menu dropdown-menu-right {{$index}}\" aria-labelledby=dropdownKebabRight_{{$index}}><li ng-repeat=\"menuAction in $ctrl.menuActions\" ng-if=\"menuAction.isVisible !== false\" role=\"{{menuAction.isSeparator === true ? 'separator' : 'menuitem'}}\" ng-class=\"{'divider': (menuAction.isSeparator === true), 'disabled': (menuAction.isDisabled === true)}\"><a ng-if=\"menuAction.isSeparator !== true\" title={{menuAction.title}} ng-click=\"$ctrl.handleMenuAction(menuAction, item)\">{{menuAction.name}}</a></li></ul></div></td></tr></tbody></table><pf-empty-state ng-if=\"$ctrl.config.itemsAvailable === false\" config=$ctrl.emptyStateConfig></pf-empty-state></div>"
  );

}]);
;angular.module('patternfly.toolbars').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('toolbars/toolbar.html',
    "<div class=container-fluid><div class=\"row toolbar-pf\" ng-class=\"{'table-view-pf-toolbar': $ctrl.isTableViewSelected()}\"><div class=col-sm-12><form class=toolbar-pf-actions ng-class=\"{'no-filter': !$ctrl.config.filterConfig}\"><div class=\"form-group toolbar-apf-filter\"><pf-filter-fields config=$ctrl.config.filterConfig ng-if=$ctrl.config.filterConfig add-filter-fn=$ctrl.addFilter></pf-filter-fields></div><div class=form-group><pf-sort config=$ctrl.config.sortConfig ng-if=\"$ctrl.config.sortConfig && $ctrl.config.sortConfig.show\"></pf-sort></div><div class=\"form-group toolbar-actions\" ng-if=\"$ctrl.config.actionsConfig &&\n" +
    "                   (($ctrl.config.actionsConfig.primaryActions && $ctrl.config.actionsConfig.primaryActions.length > 0) ||\n" +
    "                    ($ctrl.config.actionsConfig.moreActions && $ctrl.config.actionsConfig.moreActions.length > 0) ||\n" +
    "                    $ctrl.config.actionsConfig.actionsInclude)\"><button class=\"btn btn-default primary-action\" type=button ng-repeat=\"action in $ctrl.config.actionsConfig.primaryActions\" title={{action.title}} ng-click=$ctrl.handleAction(action) ng-disabled=\"action.isDisabled === true\">{{action.name}}</button><div ng-if=$ctrl.config.actionsConfig.actionsInclude pf-transclude class=toolbar-pf-include-actions ng-tranclude=actions></div><div uib-dropdown class=dropdown-kebab-pf ng-if=\"$ctrl.config.actionsConfig.moreActions && $ctrl.config.actionsConfig.moreActions.length > 0\"><button uib-dropdown-toggle class=\"btn btn-link\" type=button><span class=\"fa fa-ellipsis-v\"></span></button><ul uib-dropdown-menu aria-labelledby=dropdownKebab><li ng-repeat=\"action in $ctrl.config.actionsConfig.moreActions\" role=\"{{action.isSeparator === true ? 'separator' : 'menuitem'}}\" ng-class=\"{'divider': action.isSeparator === true, 'disabled': action.isDisabled === true}\"><a ng-if=\"action.isSeparator !== true\" class=secondary-action title={{action.title}} ng-click=$ctrl.handleAction(action)>{{action.name}}</a></li></ul></div></div><div class=toolbar-pf-action-right><div class=\"form-group toolbar-pf-view-selector\" ng-if=\"$ctrl.config.viewsConfig && $ctrl.config.viewsConfig.views\"><button ng-repeat=\"view in $ctrl.config.viewsConfig.viewsList\" class=\"btn btn-link\" ng-class=\"{'active': $ctrl.isViewSelected(view.id), 'disabled': $ctrl.checkViewDisabled(view)}\" title={{view.title}} ng-click=$ctrl.viewSelected(view.id)><i class={{view.iconClass}}></i></button></div></div></form><pf-filter-results config=$ctrl.config.filterConfig ng-if=$ctrl.config.filterConfig></pf-filter-results></div></div></div>"
  );

}]);
;angular.module('patternfly.views').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/cardview/card-view.html',
    "<span><div ng-if=\"$ctrl.config.itemsAvailable !== false\" class=card-view-pf><div class=card ng-repeat=\"item in $ctrl.items\" ng-class=\"{'pf-selectable': $ctrl.selectItems, 'active': $ctrl.isSelected(item), 'disabled': $ctrl.checkDisabled(item)}\"><div class=card-content ng-click=\"$ctrl.itemClick($event, item)\" ng-dblclick=\"$ctrl.dblClick($event, item)\"><div pf-transclude=parent></div></div><div class=card-check-box ng-if=$ctrl.config.showSelectBox><input type=checkbox value=item.selected ng-model=item.selected ng-disabled=$ctrl.checkDisabled(item) ng-change=\"$ctrl.checkBoxChange(item)\"></div></div></div><pf-empty-state ng-if=\"$ctrl.config.itemsAvailable === false\" config=$ctrl.emptyStateConfig></pf-empty-state></span>"
  );


  $templateCache.put('views/empty-state.html',
    "<div class=blank-slate-pf><div ng-if=$ctrl.config.icon class=blank-slate-pf-icon><span class={{$ctrl.config.icon}}></span></div><h1 id=title>{{$ctrl.config.title}}</h1><p id=info ng-if=$ctrl.config.info>{{$ctrl.config.info}}</p><p id=helpLink ng-if=$ctrl.config.helpLink>{{$ctrl.config.helpLink.label}} <a href={{$ctrl.config.helpLink.url}}>{{$ctrl.config.helpLink.urlLabel}}</a>.</p><div ng-if=$ctrl.hasMainActions() class=blank-slate-pf-main-action><button class=\"btn btn-primary btn-lg\" ng-repeat=\"actionButton in $ctrl.actionButtons | filter:$ctrl.filterMainActions\" title={{actionButton.title}} ng-click=$ctrl.handleButtonAction(actionButton)>{{actionButton.name}}</button></div><div ng-if=$ctrl.hasSecondaryActions() class=blank-slate-pf-secondary-action><button class=\"btn btn-default\" ng-repeat=\"actionButton in $ctrl.actionButtons | filter:$ctrl.filterSecondaryActions\" title={{actionButton.title}} ng-click=$ctrl.handleButtonAction(actionButton)>{{actionButton.name}}</button></div></div>"
  );


  $templateCache.put('views/listview/list-view.html',
    "<span><div class=\"list-group list-view-pf list-view-pf-view\" dnd-list=$ctrl.items ng-class=\"{'list-view-pf-dnd': $ctrl.config.dragEnabled === true}\" ng-if=\"$ctrl.config.itemsAvailable !== false\"><div class=dndPlaceholder></div><div class=\"list-group-item {{item.rowClass}}\" ng-repeat=\"item in $ctrl.items track by $index\" dnd-draggable=item dnd-effect-allowed=move dnd-disable-if=\"$ctrl.config.dragEnabled !== true\" dnd-dragstart=$ctrl.dragStart(item) dnd-moved=$ctrl.dragMoved() dnd-dragend=$ctrl.dragEnd() ng-class=\"{'drag-original': $ctrl.isDragOriginal(item), 'pf-selectable': $ctrl.selectItems, 'active': $ctrl.isSelected(item), 'disabled': $ctrl.checkDisabled(item), 'list-view-pf-expand-active': item.isExpanded}\"><div class=list-group-item-header><div class=list-view-pf-dnd-drag-items ng-if=\"$ctrl.config.dragEnabled === true\"><div pf-transclude=parent class=list-view-pf-main-info></div></div><div ng-class=\"{'list-view-pf-dnd-original-items': $ctrl.config.dragEnabled === true}\"><div class=list-view-pf-expand ng-if=$ctrl.config.useExpandingRows><span class=\"fa fa-angle-right\" ng-show=!item.disableRowExpansion ng-click=$ctrl.toggleItemExpansion(item) ng-class=\"{'fa-angle-down': item.isExpanded}\"></span> <span class=pf-expand-placeholder ng-show=item.disableRowExpansion></span></div><div class=list-view-pf-checkbox ng-if=$ctrl.config.showSelectBox><input type=checkbox value=item.selected ng-model=item.selected ng-disabled=$ctrl.checkDisabled(item) ng-change=\"$ctrl.checkBoxChange(item)\"></div><div class=list-view-pf-actions ng-if=\"($ctrl.actionButtons && $ctrl.actionButtons.length > 0) || ($ctrl.menuActions && $ctrl.menuActions.length > 0)\"><button class=\"btn {{actionButton.class || 'btn-default'}}\" ng-repeat=\"actionButton in $ctrl.actionButtons\" title={{actionButton.title}} ng-class=\"{'disabled' : $ctrl.checkDisabled(item) || !$ctrl.enableButtonForItem(actionButton, item)}\" ng-click=\"$ctrl.handleButtonAction(actionButton, item)\"><div ng-if=actionButton.include class=actionButton.includeClass ng-include src=actionButton.include></div><span ng-if=!actionButton.include>{{actionButton.name}}</span></button><div uib-dropdown class=\"{{$ctrl.dropdownClass}} pull-right dropdown-kebab-pf {{$ctrl.getMenuClassForItem(item)}} {{$ctrl.hideMenuForItem(item) ? 'invisible' : ''}}\" id=kebab_{{$index}} ng-if=\"$ctrl.menuActions && $ctrl.menuActions.length > 0\"><button uib-dropdown-toggle class=\"btn btn-link\" type=button id=dropdownKebabRight_{{$index}} ng-class=\"{'disabled': $ctrl.checkDisabled(item)}\" ng-click=\"$ctrl.setupActions(item, $event)\"><span class=\"fa fa-ellipsis-v\"></span></button><ul uib-dropdown-menu class=\"dropdown-menu dropdown-menu-right {{$index}}\" aria-labelledby=dropdownKebabRight_{{$index}}><li ng-repeat=\"menuAction in $ctrl.menuActions\" ng-if=\"menuAction.isVisible !== false\" role=\"{{menuAction.isSeparator === true ? 'separator' : 'menuitem'}}\" ng-class=\"{'divider': (menuAction.isSeparator === true), 'disabled': (menuAction.isDisabled === true)}\"><a ng-if=\"menuAction.isSeparator !== true\" title={{menuAction.title}} ng-click=\"$ctrl.handleMenuAction(menuAction, item)\">{{menuAction.name}}</a></li></ul></div></div><div pf-transclude=parent class=list-view-pf-main-info ng-click=\"$ctrl.itemClick($event, item)\" ng-dblclick=\"$ctrl.dblClick($event, item)\"></div></div><div class=\"list-group-item-container container-fluid\" ng-transclude=expandedContent ng-if=\"$ctrl.config.useExpandingRows && item.isExpanded\"></div></div></div></div><pf-empty-state ng-if=\"$ctrl.config.itemsAvailable === false\" config=$ctrl.emptyStateConfig></pf-empty-state></span>"
  );

}]);
;angular.module('patternfly.wizard').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('wizard/wizard-review-page.html',
    "<div class=wizard-pf-review-page><div class=wizard-pf-review-steps><ul class=list-group><li class=list-group-item ng-repeat=\"reviewStep in $ctrl.reviewSteps track by $index\"><a class=apf-form-collapse ng-class=\"{'collapsed': !reviewStep.showReviewDetails}\" ng-click=$ctrl.toggleShowReviewDetails(reviewStep)>{{reviewStep.stepTitle}}</a><div class=wizard-pf-review-substeps ng-class=\"{'collapse': !reviewStep.showReviewDetails}\"><ul class=list-group ng-if=reviewStep.substeps><li class=list-group-item ng-repeat=\"substep in reviewStep.getReviewSteps()\"><a class=apf-form-collapse ng-class=\"{'collapsed': !substep.showReviewDetails}\" ng-click=$ctrl.toggleShowReviewDetails(substep)><span class=wizard-pf-substep-number>{{$ctrl.getSubStepNumber(reviewStep, substep)}}</span> <span class=wizard-pf-substep-title>{{substep.stepTitle}}</span></a><div class=wizard-pf-review-content ng-class=\"{'collapse': !substep.showReviewDetails}\"><div ng-include=substep.reviewTemplate></div></div></li></ul><div class=wizard-pf-review-content ng-if=reviewStep.reviewTemplate ng-class=\"{'collapse': !reviewStep.showReviewDetails}\"><div ng-include=reviewStep.reviewTemplate></div></div></div></li></ul></div></div>"
  );


  $templateCache.put('wizard/wizard-step.html',
    "<section ng-show=$ctrl.selected ng-class=\"{current: $ctrl.selected, done: $ctrl.completed}\"><div ng-if=!$ctrl.wizard.hideSidebar class=wizard-pf-sidebar ng-style=$ctrl.contentStyle ng-class=$ctrl.wizard.sidebarClass ng-if=\"$ctrl.substeps === true\"><ul class=list-group><li class=list-group-item ng-class=\"{active: step.selected}\" ng-repeat=\"step in $ctrl.getEnabledSteps()\"><a ng-click=$ctrl.stepClick(step)><span class=wizard-pf-substep-number>{{$ctrl.getStepDisplayNumber(step)}}</span> <span class=wizard-pf-substep-title>{{step.title}}</span></a></li></ul></div><div class=\"wizard-pf-main {{$ctrl.wizard.stepClass}}\" ng-class=\"{'wizard-pf-singlestep': !$ctrl.substeps || $ctrl.wizard.hideSidebar}\" ng-style=$ctrl.contentStyle><div class=wizard-pf-contents ng-transclude></div></div></section>"
  );


  $templateCache.put('wizard/wizard-substep.html',
    "<subsection ng-show=$ctrl.selected ng-class=\"{current: $ctrl.selected, done: $ctrl.completed}\" class=wizard-pf-step ng-transclude></subsection>"
  );


  $templateCache.put('wizard/wizard.html',
    "<div><div class=modal-header ng-if=!$ctrl.hideHeader><button type=button class=\"close wizard-pf-dismiss\" aria-label=Close ng-click=$ctrl.onCancel() ng-if=!$ctrl.embedInPage><span aria-hidden=true>&times;</span></button><dt class=modal-title>{{$ctrl.title}}</dt></div><div class=\"modal-body wizard-pf-body clearfix\"><!-- step area --><div class=wizard-pf-steps ng-class=\"{'invisible': !$ctrl.wizardReady}\"><ul class=wizard-pf-steps-indicator ng-if=!$ctrl.hideIndicators ng-class=\"{'invisible': !$ctrl.wizardReady}\"><li class=wizard-pf-step ng-class=\"{active: step.selected}\" ng-repeat=\"step in $ctrl.getEnabledSteps()\" data-tabgroup=\"{{$index }}\"><a ng-click=$ctrl.stepClick(step) ng-class=\"{'disabled': !$ctrl.allowStepIndicatorClick(step)}\"><span class=wizard-pf-step-number>{{$index + 1}}</span> <span class=wizard-pf-step-title>{{step.title}}</span></a></li></ul></div><!-- loading wizard placeholder --><div ng-if=!$ctrl.wizardReady class=wizard-pf-main style=\"margin-left: 0px\"><div class=\"wizard-pf-loading blank-slate-pf\"><div class=\"spinner spinner-lg blank-slate-pf-icon\"></div><h3 class=blank-slate-pf-main-action>{{$ctrl.loadingWizardTitle}}</h3><p class=blank-slate-pf-secondary-action>{{$ctrl.loadingSecondaryInformation}}</p></div></div><div class=wizard-pf-position-override ng-transclude></div></div><div class=\"modal-footer wizard-pf-footer wizard-pf-position-override\" ng-class=\"{'wizard-pf-footer-inline': $ctrl.embedInPage}\"><pf-wiz-cancel class=\"btn btn-default btn-cancel wizard-pf-cancel\" ng-disabled=$ctrl.wizardDone ng-click=$ctrl.onCancel() ng-if=!$ctrl.embedInPage>{{$ctrl.cancelTitle}}</pf-wiz-cancel><div ng-if=!$ctrl.hideBackButton class=tooltip-wrapper uib-tooltip={{$ctrl.prevTooltip}} tooltip-placement=left><pf-wiz-previous id=backButton class=\"btn btn-default\" ng-disabled=\"!$ctrl.wizardReady || $ctrl.wizardDone || !$ctrl.selectedStep.prevEnabled || $ctrl.firstStep\" callback=$ctrl.backCallback><span class=\"i fa fa-angular-left\"></span> {{$ctrl.backTitle}}</pf-wiz-previous></div><div class=tooltip-wrapper uib-tooltip={{$ctrl.nextTooltip}} tooltip-placement=left><pf-wiz-next id=nextButton class=\"btn btn-primary wizard-pf-next\" ng-disabled=\"!$ctrl.wizardReady || !$ctrl.selectedStep.nextEnabled\" callback=$ctrl.nextCallback>{{$ctrl.nextTitle}} <span class=\"i fa fa-angular-right\"></span></pf-wiz-next></div><pf-wiz-cancel class=\"btn btn-default btn-cancel wizard-pf-cancel wizard-pf-cancel-inline\" ng-disabled=$ctrl.wizardDone ng-click=$ctrl.onCancel() ng-if=$ctrl.embedInPage>{{$ctrl.cancelTitle}}</pf-wiz-cancel></div></div>"
  );

}]);
