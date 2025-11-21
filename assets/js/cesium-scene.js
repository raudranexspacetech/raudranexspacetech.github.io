document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('vanta-bg');

    if (!container || typeof Cesium === 'undefined') return;

    // Create viewer with animation enabled
    const viewer = new Cesium.Viewer(container, {
        shouldAnimate: true,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        baseLayerPicker: false
    });

    // Set clock to 1200x speed
    viewer.clock.multiplier = 1200;

    // CZML data for 4 satellites
    const czmlData = [
        {
            "id": "document",
            "name": "Satellites",
            "version": "1.0"
        },
        {
            "id": "satellite1",
            "name": "Satellite 1",
            "availability": "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z",
            "position": {
                "epoch": "2024-01-01T00:00:00Z",
                "cartographicDegrees": [
                    0, 0, 0, 500000,
                    360, 0, 0, 500000,
                    720, 0, 0, 500000
                ]
            },
            "point": {
                "pixelSize": 8,
                "color": {
                    "rgba": [0, 255, 255, 255]
                }
            },
            "path": {
                "material": {
                    "solidColor": {
                        "color": {
                            "rgba": [0, 255, 255, 100]
                        }
                    }
                },
                "width": 1
            }
        },
        {
            "id": "satellite2",
            "name": "Satellite 2",
            "availability": "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z",
            "position": {
                "epoch": "2024-01-01T00:00:00Z",
                "cartographicDegrees": [
                    0, 90, 0, 500000,
                    360, 90, 0, 500000,
                    720, 90, 0, 500000
                ]
            },
            "point": {
                "pixelSize": 8,
                "color": {
                    "rgba": [0, 255, 255, 255]
                }
            },
            "path": {
                "material": {
                    "solidColor": {
                        "color": {
                            "rgba": [0, 255, 255, 100]
                        }
                    }
                },
                "width": 1
            }
        },
        {
            "id": "satellite3",
            "name": "Satellite 3",
            "availability": "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z",
            "position": {
                "epoch": "2024-01-01T00:00:00Z",
                "cartographicDegrees": [
                    0, 180, 0, 500000,
                    360, 180, 0, 500000,
                    720, 180, 0, 500000
                ]
            },
            "point": {
                "pixelSize": 8,
                "color": {
                    "rgba": [0, 255, 255, 255]
                }
            },
            "path": {
                "material": {
                    "solidColor": {
                        "color": {
                            "rgba": [0, 255, 255, 100]
                        }
                    }
                },
                "width": 1
            }
        },
        {
            "id": "satellite4",
            "name": "Satellite 4",
            "availability": "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z",
            "position": {
                "epoch": "2024-01-01T00:00:00Z",
                "cartographicDegrees": [
                    0, 270, 0, 500000,
                    360, 270, 0, 500000,
                    720, 270, 0, 500000
                ]
            },
            "point": {
                "pixelSize": 8,
                "color": {
                    "rgba": [0, 255, 255, 255]
                }
            },
            "path": {
                "material": {
                    "solidColor": {
                        "color": {
                            "rgba": [0, 255, 255, 100]
                        }
                    }
                },
                "width": 1
            }
        }
    ];

    // Load CZML data
    const dataSourcePromise = Cesium.CzmlDataSource.load(czmlData);
    viewer.dataSources.add(dataSourcePromise);

    // Set camera position - much closer to see Earth
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 10000000)
    });

    // Scroll-to-rotate functionality
    let cameraAngle = 0;
    const baseDistance = 10000000; // 10,000 km from Earth's center

    container.addEventListener('wheel', function(event) {
        event.preventDefault();

        // Adjust angle based on scroll
        cameraAngle += event.deltaY * 0.001;

        // Update camera position
        viewer.camera.position = new Cesium.Cartesian3(
            baseDistance * Math.cos(cameraAngle),
            baseDistance * Math.sin(cameraAngle),
            baseDistance * 0.3
        );
        viewer.camera.lookAt(
            Cesium.Cartesian3.ZERO,
            new Cesium.Cartesian3(0, 0, 1)
        );
    }, { passive: false });

    // Hide credits
    if (viewer.cesiumWidget.creditContainer) {
        viewer.cesiumWidget.creditContainer.style.display = 'none';
    }

    console.log('Cesium viewer with 4 satellites at 1200x speed initialized');
});
