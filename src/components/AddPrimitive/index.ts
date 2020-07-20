import { Viewer, GeometryInstance, BoxGeometry, Cartesian3, VertexFormat, Appearance, PerInstanceColorAppearance, ColorGeometryInstanceAttribute, Color, Primitive, Transforms, Cartographic, HeadingPitchRoll, HeadingPitchRange, Math, GeometryAttributes, GeometryAttribute, ComponentDatatype, Geometry, PrimitiveType, BoundingSphere, BlendingState, Matrix4, MaterialAppearance, Material, GeometryPipeline, buildModuleUrl, RectangleGeometry, Rectangle, EllipsoidSurfaceAppearance } from "cesium";

/**
 * 添加primitive图元
 * @module ls/AddPrimitive
 */
class AddPrimitive {
    constructor(viewer: Viewer) {
        this.viewer = viewer;
        this.clear();
    }
    setIntervalID: number | undefined;
    viewer: Viewer
    modelMat4() {
        const coor = Cartographic.fromDegrees(-95.0, 40.0, 100.0);//定义模型世界坐标系中位置)
        const origin = Cartographic.toCartesian(coor);
        const modelMat4 = Transforms.eastNorthUpToFixedFrame(origin);
        return modelMat4;
    }
    /**
     * 清楚primitive类型的图元
     */
    clear() {
        const len = this.viewer.scene.primitives.length;//scene中图元数量
        const collection = this.viewer.scene.primitives;
        for (let i = 0; i < len; i++) {//删除全部gltf model
            const primitive = collection.get(i);
            if (primitive instanceof Primitive) {
                collection.remove(primitive);
            }
        }
        clearInterval();
    }
    /**
     * 添加cesium定义的盒子几何实例
     */
    addBox() {
        const coor = Cartographic.fromDegrees(-95.0, 40.0, 1000.0);//定义模型世界坐标系中位置)
        const origin = Cartographic.toCartesian(coor);
        const mat4 = this.modelMat4();
        const box = new BoxGeometry({
            minimum: new Cartesian3(-20, -20, 0),
            maximum: new Cartesian3(20, 20, 40),
            vertexFormat: VertexFormat.POSITION_ONLY
        });
        const geometryInstance = new GeometryInstance({
            geometry: BoxGeometry.createGeometry(box) as any,
            modelMatrix: mat4,
            id: "box",
            attributes: {
                color: ColorGeometryInstanceAttribute.fromColor(Color.RED.withAlpha(0.5))
            }
        });
        const appearance = new PerInstanceColorAppearance({
            flat: true
        });
        const primitive = new Primitive({
            geometryInstances: [geometryInstance],
            appearance: appearance,
            asynchronous: false
        });
        this.viewer.scene.primitives.add(primitive);
        this.viewer.camera.flyTo({
            destination: origin,
            orientation: {
                heading: 0,
                pitch: Math.toRadians(-90),
                roll: 0
            }
        })
    }
    /**
     * 自定义矩形图元,使用纯颜色
     */
    customRectangle() {
        const coor = Cartographic.fromDegrees(-95.0, 40.0, 1000.0);//定义模型世界坐标系中位置)
        const origin = Cartographic.toCartesian(coor);
        const mat4 = this.modelMat4();
        const vertices = new Float64Array([//顶点坐标
            -20, -20, 0,
            20, -20, 0,
            20, 20, 0,
            -20, 20, 0
        ]);
        const colors = new Float32Array([//顶点颜色
            1.0, 0.0, 0.0, 0.5,
            0.0, 1.0, 0.0, 0.5,
            0.0, 0.0, 1.0, 0.5,
            0.0, 1.0, 1.0, 0.5
        ]);
        //let positions=new Float64Array;
        const attributes = new GeometryAttributes();
        const indices = new Uint16Array(6);
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;
        indices[3] = 0;
        indices[4] = 2;
        indices[5] = 3;
        attributes.position = new GeometryAttribute({
            componentDatatype: ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: vertices
        });
        attributes.color = new GeometryAttribute({
            componentDatatype: ComponentDatatype.FLOAT,
            componentsPerAttribute: 4,
            values: colors
        });
        //几何信息
        const rect = new Geometry({
            attributes: attributes,
            primitiveType: PrimitiveType.TRIANGLES,
            indices: indices,
            boundingSphere: BoundingSphere.fromVertices(vertices as any)
        });
        //着色器
        const vShader = `
        attribute vec3 position3DHigh;
        attribute vec3 position3DLow;
        attribute vec4 color;
        varying vec4 v_color;
        attribute float batchId;
        void main(){
            vec4 p = czm_computePosition();  //The position relative to eye
            v_color =color;
            p = czm_modelViewProjectionRelativeToEye * p;
            gl_Position=p;
        }
        `;
        const fShader = `
            varying vec4 v_color;
            void main(){
                gl_FragColor=v_color;
            }
        `;
        const appearance = new Appearance({
            renderState: {
                blending: BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,  //混合
                depthTest: { enabled: true }, //深度测试
                depthMask: true
            },
            fragmentShaderSource: fShader,
            vertexShaderSource: vShader
        });
        const instance1 = new GeometryInstance({
            geometry: rect,
            modelMatrix: mat4,
            id: 'low'
        });
        const instance2 = new GeometryInstance({
            geometry: rect,
            modelMatrix: Matrix4.multiplyByTranslation(mat4, new Cartesian3(0, 0, 50), new Matrix4()),
            id: 'high'
        });
        const primitive = new Primitive({
            geometryInstances: [instance1],
            appearance: appearance,
            asynchronous: false,
            releaseGeometryInstances: false
        })
        this.viewer.scene.primitives.add(primitive);
        this.viewer.camera.flyTo({
            destination: origin,
            orientation: {
                heading: 0,
                pitch: Math.toRadians(-90),
                roll: 0
            }
        })
        const viewer = this.viewer;
        let count = 0;
        //this.viewer.scene.preRender.addEventListener(function(){
        const setIntervalID = setInterval(function () {
            ++count;
            if (count === 4) {
                clearInterval(setIntervalID);
            }
            viewer.scene.primitives.removeAll();
            const highattributes = (primitive.geometryInstances as GeometryInstance[])[0].geometry.attributes;
            const attribColor = highattributes.color.values;
            const newColors = new Float32Array(16);
            //colors
            newColors[0] = attribColor[4];
            newColors[1] = attribColor[5];
            newColors[2] = attribColor[6];
            newColors[3] = attribColor[7];

            newColors[4] = attribColor[8];
            newColors[5] = attribColor[9];
            newColors[6] = attribColor[10];
            newColors[7] = attribColor[11];

            newColors[8] = attribColor[12];
            newColors[9] = attribColor[13];
            newColors[10] = attribColor[14];
            newColors[11] = attribColor[15];

            newColors[12] = attribColor[0];
            newColors[13] = attribColor[1];
            newColors[14] = attribColor[2];
            newColors[15] = attribColor[3];
            attributes.color = new GeometryAttribute({
                componentDatatype: ComponentDatatype.FLOAT,
                componentsPerAttribute: 4,
                values: newColors
            })
            const newRect = new Geometry({
                attributes: attributes,
                primitiveType: PrimitiveType.TRIANGLES,
                indices: indices,
                boundingSphere: BoundingSphere.fromVertices(vertices as any)
            });
            viewer.scene.primitives.add(new Primitive({
                geometryInstances: [new GeometryInstance({
                    geometry: newRect,
                    modelMatrix: mat4
                })],
                appearance: appearance,
                asynchronous: false
            }))
        }, 500)

        //})
    }
    /**
     * 自定义纹理贴图
     */
    customMaterial() {
        const viewer = this.viewer;
        const scene = this.viewer.scene;
        const coor = Cartographic.fromDegrees(-95.0, 40.0, 10000.0);//定义模型世界坐标系中位置)
        const origin = Cartographic.toCartesian(coor);
        const mat4 = this.modelMat4();
        const vertices = new Float64Array([//顶点坐标
            -2000, -2000, 0,
            2000, -2000, 0,
            2000, 2000, 0,
            -2000, 2000, 0
        ]);
        const st = new Float32Array([//纹理坐标
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ])
        //let positions=new Float64Array;
        const attributes = new GeometryAttributes();
        const indices = new Uint16Array(6);//顶点索引
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;
        indices[3] = 0;
        indices[4] = 2;
        indices[5] = 3;
        attributes.position = new GeometryAttribute({//顶点attributes
            componentDatatype: ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: vertices
        });
        attributes.st = new GeometryAttribute({
            componentDatatype: ComponentDatatype.FLOAT,
            componentsPerAttribute: 2,
            values: st
        })
        //自定义几何图形时，使用图片纹理，需要自己设置st,normal属性
        const rect = new Geometry({
            attributes: attributes,
            primitiveType: PrimitiveType.TRIANGLES,
            indices: indices,
            boundingSphere: BoundingSphere.fromVertices(vertices as any)
        });
        GeometryPipeline.computeNormal(rect);
        const instance = new GeometryInstance({
            geometry: rect,
            modelMatrix: mat4,
            id: 'rect'
        })
        const primitive = new Primitive({
            geometryInstances: [instance],
            appearance: new MaterialAppearance({
                flat: true,
                material: new Material({
                    fabric: {
                        uniforms: {
                            image: './images/Cesium_Logo_Color.jpg',
                            speed: 0.0
                        },
                        source: `
                        czm_material czm_getMaterial(czm_materialInput materialInput)\n
                        {\n
                            vec3 red=vec3(1.0,0.0,0.0);
                            czm_material material = czm_getDefaultMaterial(materialInput);\n
                            if(materialInput.st.x<=speed){\n
                                material.diffuse = czm_gammaCorrect(texture2D(image, fract(materialInput.st)).rgb *red);\n 
                            }\n
                            else{\n
                                material.diffuse = czm_gammaCorrect(texture2D(image, fract(materialInput.st)).rgb);\n 
                            }\n
                            material.alpha = texture2D(image, fract(materialInput.st)).a;\n
                            return material;\n
                        }\n
                        `
                    }
                }),
                materialSupport: MaterialAppearance.MaterialSupport.TEXTURED
            }),
            compressVertices: false,
            asynchronous: false
        });
        scene.primitives.add(primitive);
        this.viewer.camera.flyTo({
            destination: origin,
            orientation: {
                heading: 0,
                pitch: Math.toRadians(-90),
                roll: 0
            }
        })
        let speed = 0.0;
        const setIntervalID = setInterval(function () {//如果使用scene.preUpdate等帧刷新，则Logo.jpg不显示
            if (speed <= 1.0) {
                speed += 0.05;
            } else {
                clearInterval(setIntervalID);
                speed = 0.0
            }
            primitive.appearance.material = new Material({
                fabric: {
                    uniforms: {
                        image: './images/Cesium_Logo_Color.jpg',
                        speed: speed
                    },
                    source: `
                        czm_material czm_getMaterial(czm_materialInput materialInput)\n
                        {\n
                            vec3 red=vec3(1.0,0.0,0.0);\n
                            czm_material material = czm_getDefaultMaterial(materialInput);\n
                            if(materialInput.st.x<=speed){\n //纹理X坐标小于speed添加红色
                                material.diffuse = czm_gammaCorrect(texture2D(image, fract(materialInput.st)).rgb *red);\n 
                            }\n
                            else{\n
                                material.diffuse = czm_gammaCorrect(texture2D(image, fract(materialInput.st)).rgb);\n 
                            }\n
                            material.alpha = texture2D(image, fract(materialInput.st)).a;\n
                            return material;\n
                        }\n
                        `
                }
            })
        }, 500)
    }
    /**
     * 水面贴图
     * 
     */
    customWater() {
        const viewer = this.viewer;
        const scene = this.viewer.scene;
        const coor = Cartographic.fromDegrees(-95.0, 40.0, 10000.0);//定义模型世界坐标系中位置)
        const origin = Cartographic.toCartesian(coor);
        const mat4 = this.modelMat4();
        const vertices = new Float64Array([//顶点坐标
            -2000, -2000, 0,
            2000, -2000, 0,
            2000, 2000, 0,
            -2000, 2000, 0
        ]);
        const st = new Float32Array([//纹理坐标
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ])
        //let positions=new Float64Array;
        const attributes = new GeometryAttributes();
        const indices = new Uint16Array(6);//顶点索引
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;
        indices[3] = 0;
        indices[4] = 2;
        indices[5] = 3;
        attributes.position = new GeometryAttribute({//顶点attributes
            componentDatatype: ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: vertices
        });
        attributes.st = new GeometryAttribute({
            componentDatatype: ComponentDatatype.FLOAT,
            componentsPerAttribute: 2,
            values: st
        })
        //使用水面着色器时，使用图片纹理，需要自己设置st,position属性。
        //normal会在片元着色器中计算。为原点到顶点坐标矢量方向
        const rect = new Geometry({
            attributes: attributes,
            primitiveType: PrimitiveType.TRIANGLES,
            indices: indices,
            boundingSphere: BoundingSphere.fromVertices(vertices as any)
        });
        const instance = new GeometryInstance({
            geometry: rect,
            modelMatrix: mat4,
            id: 'rect'
        })
        //实质就是使用EllipsoidSurfaceAppearance的顶点着色器和片元着色器
        const primitive = new Primitive({
            geometryInstances: [instance],
            asynchronous: false,
            appearance: new MaterialAppearance({
                material: new Material({
                    fabric: {
                        type: 'Water',
                        uniforms: {
                            normalMap: buildModuleUrl("Assets/Textures/waterNormals.jpg"),
                            frequency: 1000.0,
                            animationSpeed: 0.01,
                            amplitude: 1.0,
                        }
                    }
                }),
                vertexShaderSource: "attribute vec3 position3DHigh;\n\
                attribute vec3 position3DLow;\n\
                attribute vec2 st;\n\
                attribute float batchId;\n\
                \n\
                varying vec3 v_positionMC;\n\
                varying vec3 v_positionEC;\n\
                varying vec2 v_st;\n\
                \n\
                void main()\n\
                {\n\
                    vec4 p = czm_computePosition();\n\
                \n\
                    v_positionMC = position3DHigh + position3DLow;           // position in model coordinates\n\
                    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;     // position in eye coordinates\n\
                    v_st = st;\n\
                \n\
                    gl_Position = czm_modelViewProjectionRelativeToEye * p;\n\
                }\n\
                ",
                fragmentShaderSource: "varying vec3 v_positionMC;\n\
                varying vec3 v_positionEC;\n\
                varying vec2 v_st;\n\
                \n\
                void main()\n\
                {\n\
                    czm_materialInput materialInput;\n\
                \n\
                    vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n\
                #ifdef FACE_FORWARD\n\
                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\
                #endif\n\
                \n\
                    materialInput.s = v_st.s;\n\
                    materialInput.st = v_st;\n\
                    materialInput.str = vec3(v_st, 0.0);\n\
                \n\
                    // Convert tangent space material normal to eye space\n\
                    materialInput.normalEC = normalEC;\n\
                    materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\
                \n\
                    // Convert view vector to world space\n\
                    vec3 positionToEyeEC = -v_positionEC;\n\
                    materialInput.positionToEyeEC = positionToEyeEC;\n\
                \n\
                    czm_material material = czm_getMaterial(materialInput);\n\
                \n\
                #ifdef FLAT\n\
                    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n\
                #else\n\
                    gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n\
                #endif\n\
                }\n\
                "
            })
        });
        scene.primitives.add(primitive);
        this.viewer.camera.flyTo({
            destination: origin,
            orientation: {
                heading: 0,
                pitch: Math.toRadians(-90),
                roll: 0
            }
        })
    }
    /**
     * 在box图元中添加水面贴图
     * 
     */
    customWaterWithBox() {
        const coor = Cartographic.fromDegrees(-95.0, 40.0, 1000.0);//定义模型世界坐标系中位置)
        const origin = Cartographic.toCartesian(coor);
        const mat4 = this.modelMat4();
        const boxGeo = new BoxGeometry({//box顶点坐标信息及st贴图坐标信息（模型坐标系）
            minimum: new Cartesian3(-500, -500, 0),
            maximum: new Cartesian3(500, 500, 500),
            vertexFormat: VertexFormat.POSITION_AND_ST
        });
        const instance = new GeometryInstance({//box实例（世界坐标系）
            geometry: boxGeo,
            modelMatrix: mat4,
            id: 'waterbox'
        });
        const appearance = new MaterialAppearance({//box实例贴图
            flat:false,//是否考虑光源,true表示不考虑光源，false表示考虑光源，并使用phong算法
            materialSupport: MaterialAppearance.MaterialSupport.TEXTURED,
            material: new Material({
                fabric: {
                    type: 'Water',
                    uniforms: {
                        normalMap: buildModuleUrl("Assets/Textures/waterNormals.jpg"),
                        frequency: 100.0,
                        animationSpeed: 0.01,
                        amplitude: 1.0
                    }
                }
            }),
            vertexShaderSource: "attribute vec3 position3DHigh;\n\
            attribute vec3 position3DLow;\n\
            attribute vec2 st;\n\
            attribute float batchId;\n\
            \n\
            varying vec3 v_positionMC;\n\
            varying vec3 v_positionEC;\n\
            varying vec2 v_st;\n\
            \n\
            void main()\n\
            {\n\
                vec4 p = czm_computePosition();\n\
            \n\
                v_positionMC = position3DHigh + position3DLow;           // position in model coordinates\n\
                v_positionEC = (czm_modelViewRelativeToEye * p).xyz;     // position in eye coordinates\n\
                v_st = st;\n\
            \n\
                gl_Position = czm_modelViewProjectionRelativeToEye * p;\n\
            }\n\
            ",
            fragmentShaderSource: "varying vec3 v_positionMC;\n\
                varying vec3 v_positionEC;\n\
                varying vec2 v_st;\n\
                \n\
                void main()\n\
                {\n\
                    czm_materialInput materialInput;\n\
                \n\
                    vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n\
                #ifdef FACE_FORWARD\n\
                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\
                #endif\n\
                \n\
                    materialInput.s = v_st.s;\n\
                    materialInput.st = v_st;\n\
                    materialInput.str = vec3(v_st, 0.0);\n\
                \n\
                    // Convert tangent space material normal to eye space\n\
                    materialInput.normalEC = normalEC;\n\
                    materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\
                \n\
                    // Convert view vector to world space\n\
                    vec3 positionToEyeEC = -v_positionEC;\n\
                    materialInput.positionToEyeEC = positionToEyeEC;\n\
                \n\
                    czm_material material = czm_getMaterial(materialInput);\n\
                \n\
                #ifdef FLAT\n\
                    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n\
                #else\n\
                    gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n\
                #endif\n\
                }\n\
                "
        })
        const primitive=new Primitive({
            geometryInstances:[instance],
            appearance:appearance,
            asynchronous:false
        })
        this.viewer.scene.primitives.add(primitive);
        this.viewer.camera.flyTo({
            destination:origin,
            orientation:{
                heading:0,
                pitch:Math.toRadians(-90),
                roll:0
            }
        })
    }
}
export default AddPrimitive;