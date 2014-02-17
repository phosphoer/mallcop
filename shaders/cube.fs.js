var cube_fs_shader = "\
uniform lowp vec4 uColor;\
\
varying lowp vec3 vNormal;\
varying lowp vec3 vDirectionalLight;\
varying lowp vec3 vFragPos;\
varying lowp vec3 vSpotPos;\
varying lowp vec3 vSpotDir;\
\
void main(void)\
{\
  lowp vec4 AmbientLight = uColor * vec4(0.1,0.1,0.1,1.0);\
  \
  lowp vec3 normal = normalize(vNormal);\
  lowp vec3 light = normalize(vDirectionalLight);\
  lowp vec4 DirectionalLight = 0.1*(uColor * max(dot(normal,light), 0.0));\
  \
  lowp vec3 normSpotDir = normalize(vSpotDir);\
  lowp vec3 lightDir = vSpotPos - vFragPos;\
  lowp vec3 lightNormDir = normalize(lightDir);\
  lowp float spotIntensity = max(dot(lightNormDir, normal), 0.0);\
  lowp float spotCheck = float((dot(lightNormDir, normSpotDir) > 0.85));\
  spotIntensity = spotCheck * spotIntensity;\
  lowp vec4 SpotLight = spotIntensity * uColor * clamp(mix(0.0,1.0,3.0 / length(lightDir)), 0.0, 1.0);\
  \
  gl_FragColor = SpotLight + DirectionalLight;\
  gl_FragColor.a = 1.0;\
}\
"