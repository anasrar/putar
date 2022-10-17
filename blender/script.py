import os
import bpy
import math
from typing import cast

EXPORT_PATH = os.path.join(os.getcwd(), "web/public/models/projections.glb")

# clear all default object
if bpy.context.active_object and bpy.context.active_object.mode != "OBJECT":
    bpy.ops.object.mode_set(mode="OBJECT")
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=True)
bpy.ops.outliner.orphans_purge(
    do_local_ids=True,
    do_linked_ids=True,
    do_recursive=False
)

# equirectangular
bpy.ops.mesh.primitive_uv_sphere_add(
    radius=5,
    enter_editmode=True,
    align="WORLD",
    location=[0, 0, 0],
    rotation=[0, 0, -1.5708],
    scale=[-1, 1, -1]
)
bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.flip_normals()
bpy.ops.object.mode_set(mode="OBJECT")
bpy.context.active_object.name = "equirectangular"
bpy.context.active_object.data.name = "equirectangular"
bpy.ops.object.shade_smooth()
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
bpy.ops.object.select_all(action="DESELECT")

# cubemap
bpy.ops.mesh.primitive_cube_add(
    size=10,
    enter_editmode=True,
    align="WORLD",
    location=[0, 0, 0],
    rotation=[0, 0, -1.5708],
    scale=[-1, 1, -1]
)
bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.flip_normals()
bpy.ops.object.mode_set(mode="OBJECT")
# scale and rotate uv
mesh = cast(bpy.types.Mesh, bpy.context.active_object.data)
uv_layers = cast(dict[str, bpy.types.MeshUVLoopLayer], mesh.uv_layers)
uv_data = cast(list[bpy.types.MeshUVLoop], uv_layers["UVMap"].data)
for data in uv_data:
    data.uv[0] = ((data.uv[0] - 0.5) * 1.333 + 0.5)
    angle = math.pi / 2
    c = math.cos(angle)
    s = math.sin(angle)
    data.uv = [1 + (c * data.uv[0] - s * data.uv[1]),
               s * data.uv[0] + c * data.uv[1]]
bpy.context.active_object.name = "cubemap"
bpy.context.active_object.data.name = "cubemap"
bpy.ops.object.shade_flat()
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
bpy.ops.object.select_all(action="DESELECT")

# export glb
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(
    filepath=EXPORT_PATH,
    check_existing=False,
    export_format="GLB",
    export_copyright="Public Domain",
    export_texcoords=True,
    export_normals=True,
    export_tangents=True,
    export_materials="NONE",
    export_colors=False,
    export_cameras=False,
    export_draco_mesh_compression_enable=False,
    use_selection=True,
    use_visible=False,
    use_renderable=False,
    use_active_collection=False,
    export_extras=True,
    export_yup=True,
    export_apply=True,
    export_animations=False,
)
