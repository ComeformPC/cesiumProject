import { Viewer, GeometryInstance, BoxGeometry, Cartesian3, VertexFormat, Appearance, PerInstanceColorAppearance, ColorGeometryInstanceAttribute, Color, Primitive, Transforms, Cartographic, HeadingPitchRoll, HeadingPitchRange, Math, GeometryAttributes, GeometryAttribute, ComponentDatatype, Geometry, PrimitiveType, BoundingSphere, BlendingState, Matrix4, MaterialAppearance, Material, GeometryPipeline } from "cesium";

/**
 * 添加primitive图元
 * 
 */
class AddPrimitive {
    constructor(viewer: Viewer) {
        this.viewer = viewer;
    }
    viewer: Viewer
    modelMat4() {
        const coor = Cartographic.fromDegrees(-95.0, 40.0, 10.0);//定义模型世界坐标系中位置)
        const origin = Cartographic.toCartesian(coor);
        const modelMat4 = Transforms.eastNorthUpToFixedFrame(origin);
        return modelMat4;
    }
    /**
     * 添加盒子
     */
    addBox() {
        const coor = Cartographic.fromDegrees(-95.0, 40.0, 100.0);//定义模型世界坐标系中位置)
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
                pitch: Math.toRadians(-60),
                roll: 0
            }
        })
    }
    /**
     * 自定义矩形图元,使用纯颜色
     */
    customRectangle() {
        const coor = Cartographic.fromDegrees(-95.0, 40.0, 100.0);//定义模型世界坐标系中位置)
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
                pitch: Math.toRadians(-60),
                roll: 0
            }
        })
        const viewer=this.viewer;
        //this.viewer.scene.preRender.addEventListener(function(){
        setInterval(function () {
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
                geometryInstances:[new GeometryInstance({
                    geometry:newRect,
                    modelMatrix:mat4
                })],
                appearance:appearance,
                asynchronous:false
            }))
        }, 500)

        //})
    }
    /**
     * 自定义纹理贴图
     */
    customMaterial(){
        const viewer=this.viewer;
        const scene=this.viewer.scene;
        const coor = Cartographic.fromDegrees(-95.0, 40.0, 10000.0);//定义模型世界坐标系中位置)
        const origin = Cartographic.toCartesian(coor);
        const mat4 = this.modelMat4();
        const vertices = new Float64Array([//顶点坐标
            -2000, -2000, 0,
            2000, -2000, 0,
            2000, 2000, 0,
            -2000, 2000, 0
        ]);
        const st=new Float32Array([//纹理坐标
            0.0,0.0,
            1.0,0.0,
            1.0,1.0,
            0.0,1.0
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
        attributes.position=new GeometryAttribute({//顶点attributes
            componentDatatype:ComponentDatatype.DOUBLE,
            componentsPerAttribute:3,
            values:vertices
        });
        attributes.st=new GeometryAttribute({
            componentDatatype:ComponentDatatype.FLOAT,
            componentsPerAttribute:2,
            values:st
        })
        //自定义几何图形时，使用图片纹理，需要自己设置st,normal属性
        const rect=new Geometry({
            attributes:attributes,
            primitiveType:PrimitiveType.TRIANGLES,
            indices:indices,
            boundingSphere:BoundingSphere.fromVertices(vertices as any)
        });
        GeometryPipeline.computeNormal(rect);
        const instance=new GeometryInstance({
            geometry:rect,
            modelMatrix:mat4,
            id:'rect'
        })
        const primitive=new Primitive({
            geometryInstances:[instance],
            appearance:new MaterialAppearance({
                flat:true,
                material:new Material({
                    fabric:{
                        type:'Image',
                        uniforms:{
                            image:'./images/Cesium_Logo_Color.jpg'
                        }
                    }
                }),
                materialSupport:MaterialAppearance.MaterialSupport.TEXTURED
            }),
            compressVertices:false,
            asynchronous:false
        });
        scene.primitives.add(primitive);
        this.viewer.camera.flyTo({
            destination: origin,
            orientation: {
                heading: 0,
                pitch: Math.toRadians(-60),
                roll: 0
            }
        })
    }
}
export default AddPrimitive;