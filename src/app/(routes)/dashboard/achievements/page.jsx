return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Achievements</h1>
    <div className="grid gap-4">
      {userAchievements.map((ach) => {
        const meta = ALL_ACHIEVEMENTS.find((a) => a.name === ach.name);
        const Icon = meta?.icon;

        return (
          <div
            key={ach.name}
            className={`border p-4 rounded-xl flex items-start gap-4 ${
              ach.earned ? "bg-green-100 border-green-500" : "bg-white"
            }`}
          >
            {Icon && <Icon className="w-6 h-6 mt-1 text-green-600" />}
            <div>
              <h2 className="text-lg font-semibold">{ach.name}</h2>
              <p className="text-gray-600">{meta?.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Progress: {ach.progress} / {ach.target}
              </div>

              {/* Claimed */}
              {ach.earned && ach.claimed === 1 && (
                <span className="text-green-600 font-semibold">
                  ✅ Claimed
                </span>
              )}

              {/* Ready to Claim */}
              {ach.earned && ach.claimed === 0 && (
                <button
                  onClick={() => handleClaim(ach.name)}
                  className="mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                  Claim Reward
                </button>
              )}

              {/* Locked */}
              {!ach.earned && (
                <span className="text-gray-400 italic mt-2 block">
                  🔒 Unclaimed
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
