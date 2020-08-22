function fn() {   
    var config = {
    }
    config.scratch = java.nio.file.Files.createTempDirectory('jbang').toAbsolutePath().toString();

    var sc = config.scratch;
    karate.log('scratch', sc);

    config.fileexist = function fn(file) {
        return java.nio.file.Files.exists(java.nio.file.Paths.get(file))
    }

    config.command = function fn(line, env) {
        if (!env) {
            env = {}
        }
        
        // provide default scratch directory for temporary content
        !('SCRATCH' in env) && (env.SCRATCH = sc)
        // set JBANG_REPO to not mess with users own ~/.m2
        sep = java.io.File.separator;

        !('JBANG_REPO' in env) && (env.JBANG_REPO = sc + sep + "m2")
        !('JBANG_DIR' in env) && (env.JBANG_DIR = sc + sep + "jbang")
        
        var proc = karate.fork({ redirectErrorStream: false, useShell: true, line: line, env: env});
        proc.waitSync();
        karate.set('out', proc.sysOut);
        karate.set('err', proc.sysErr);
        karate.set('exit', proc.exitCode);
      }

      var version = java.lang.System.getProperty('java.version');
      if(version.startsWith("1.")) {
            version = version.substring(2, 3);
        } else {
            var dot = version.indexOf(".");
            if(dot != -1) { version = version.substring(0, dot); }
        }
    
    config.javaversion = version;
    config.windows = karate.os.type == "windows";
    karate.log('operating system', karate.os);
    karate.log('isWindows', config.windows)
    karate.log('javaversion', config.javaversion)
    karate.log('os.name', karate.properties['os.name']);

    karate.log('')
    return config;
  }