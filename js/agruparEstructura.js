import * as THREE from 'three';

// Fusion por material y sector; bake de repeticion UV para compartir materiales.
export function agruparEstructura(castillo) {
  castillo.updateMatrixWorld(true);
  const excluir=new Set();
  for(const p of castillo.userData.puertas||[])p.marco.traverse(o=>excluir.add(o));
  const contenidos=/^(Mesa|Armario|Estanteria|Libros|Cama|Cabecera)(\s|$)/i;
  const imagenes=new WeakMap();let siguiente=0;
  const idImagen=t=>{if(!t)return '-';const im=t.image;if(!im||typeof im!=='object')return t.uuid;if(!imagenes.has(im))imagenes.set(im,++siguiente);return imagenes.get(im);};
  const firma=m=>[m.type,m.color?.getHex(),m.roughness,m.metalness,m.side,m.bumpScale,m.polygonOffset,m.polygonOffsetFactor,m.polygonOffsetUnits,m.dithering,
    idImagen(m.map),idImagen(m.bumpMap),m.map?.wrapS,m.map?.wrapT].join(':');
  const lotes=new Map(),materiales=new Map(),noIndex=new Map(),ocultados=[];
  const inv=new THREE.Matrix4().copy(castillo.matrixWorld).invert(),transform=new THREE.Matrix4(),normal=new THREE.Matrix3();
  const v=new THREE.Vector3(),n=new THREE.Vector3(),centro=new THREE.Vector3();
  let llamadasOriginales=0;
  function elegible(o) {
    if(!o.isMesh||o.isInstancedMesh||o.children.length||!o.visible||excluir.has(o)||contenidos.test(o.name)||o.userData.habitacion)return false;
    for(let p=o.parent;p;p=p.parent)if(!p.visible)return false;
    const ms=Array.isArray(o.material)?o.material:[o.material];
    return ms.every(m=>m&&m.isMeshStandardMaterial&&!m.transparent&&!m.vertexColors&&!(m.emissive&&(m.emissive.r>0||m.emissive.g>0||m.emissive.b>0))&&!m.normalMap&&!m.aoMap&&!m.alphaMap&&
      (!m.map||!m.map.rotation)&&(!m.bumpMap||!m.map||(m.bumpMap.repeat.equals(m.map.repeat)&&m.bumpMap.offset.equals(m.map.offset))));
  }
  const fuentes=[];castillo.traverse(o=>{if(elegible(o))fuentes.push(o);});
  for(const o of fuentes) {
    let g=noIndex.get(o.geometry);
    if(!g){g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();noIndex.set(o.geometry,g);}
    if(!g.attributes.normal||!g.attributes.uv)continue;
    transform.multiplyMatrices(inv,o.matrixWorld);normal.getNormalMatrix(transform);
    o.getWorldPosition(centro).applyMatrix4(inv);
    const sector=`${Math.floor(centro.x/14)},${Math.floor(centro.y/12)},${Math.floor(centro.z/14)}`;
    const ms=Array.isArray(o.material)?o.material:[o.material];
    const grupos=Array.isArray(o.material)?g.groups:[{start:0,count:g.attributes.position.count,materialIndex:0}];
    if(!grupos.length)continue;
    for(const grupo of grupos) {
      const m=ms[grupo.materialIndex||0],f=firma(m),key=sector+':'+f+':'+o.castShadow+':'+o.receiveShadow;
      if(!materiales.has(f)){
        const nuevo=m.clone();
        for(const campo of ['map','bumpMap'])if(nuevo[campo]){nuevo[campo]=nuevo[campo].clone();nuevo[campo].repeat.set(1,1);nuevo[campo].offset.set(0,0);nuevo[campo].needsUpdate=true;}
        materiales.set(f,nuevo);
      }
      if(!lotes.has(key))lotes.set(key,{p:[],n:[],uv:[],material:materiales.get(f),cast:o.castShadow,receive:o.receiveShadow});
      const b=lotes.get(key),t=m.map||m.bumpMap;
      for(let i=grupo.start;i<grupo.start+grupo.count;i++){
        v.fromBufferAttribute(g.attributes.position,i).applyMatrix4(transform);n.fromBufferAttribute(g.attributes.normal,i).applyMatrix3(normal).normalize();
        b.p.push(v.x,v.y,v.z);b.n.push(n.x,n.y,n.z);
        b.uv.push(g.attributes.uv.getX(i)*(t?.repeat.x??1)+(t?.offset.x??0),g.attributes.uv.getY(i)*(t?.repeat.y??1)+(t?.offset.y??0));
      }
      llamadasOriginales++;
    }
    o.visible=false;ocultados.push(o);
  }
  const grupo=new THREE.Group();grupo.name='Estructura agrupada por sectores';castillo.add(grupo);
  for(const b of lotes.values()){
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(b.n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(b.uv,2));g.computeBoundingSphere();g.computeBoundingBox();
    const o=new THREE.Mesh(g,b.material);o.castShadow=b.cast;o.receiveShadow=b.receive;grupo.add(o);
  }
  for(const g of noIndex.values())g.dispose();
  return {mallasOriginales:ocultados.length,gruposOriginales:llamadasOriginales,lotesNuevos:lotes.size,
    nota:'Conteos de geometria agrupada; no son mediciones de draw calls de un fotograma.'};
}
