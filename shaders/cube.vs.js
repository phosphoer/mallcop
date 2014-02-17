var cube_vs_shader = "\
attribute vec3 aVertexPosition;\
attribute vec3 aVertexNormal;\
\
uniform vec3 uPosition;\
uniform lowp vec3 uSpotDir;\
uniform lowp vec3 uSpotPos;\
uniform mat4 uViewProjectionMatrix;\
uniform mat4 uViewMatrix;\
uniform float uScale;\
\
varying lowp vec3 vNormal;\
varying lowp vec3 vDirectionalLight;\
varying lowp vec3 vFragPos;\
varying lowp vec3 vSpotPos;\
varying lowp vec3 vSpotDir;\
\
void main(void)\
{\
  gl_Position = uViewProjectionMatrix * vec4(aVertexPosition * uScale + uPosition, 1.0);\
  vNormal = (uViewMatrix * vec4(aVertexNormal, 0.0)).xyz;\
  vDirectionalLight = (uViewMatrix * vec4(-1.0, 4.0, -7.0, 0.0)).xyz;\
  vFragPos = (uViewMatrix * vec4(aVertexPosition + uPosition, 1.0)).xyz;\
  vSpotDir = (uViewMatrix * vec4(uSpotDir, 0.0)).xyz;\
  vSpotPos = (uViewMatrix * vec4(uSpotPos,1.0)).xyz;\
}\
"