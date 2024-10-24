import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Directors from "@/app/lib/models/Directors";

// Connect to your MongoDB database
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return; // Already connected
  }
  await mongoose.connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Update Director Handler
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Connect to MongoDB
  await connectDB();

  // Parse incoming request body
  const body = await req.json();

  // Ensure the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid Director ID" }, { status: 400 });
  }

  try {
    // Find the Director by ID
    const director = await Directors.findById(id);

    if (!director) {
      return NextResponse.json(
        { error: "Director not found" },
        { status: 404 }
      );
    }

    // Update director credentials (handle optional fields as well)
    const updateFields = {
      fullname: body.fullname || director.fullname,
      email: body.email || director.email,
      password: body.password || director.password, // Make sure you hash password before saving
      schoolName: body.schoolName || director.schoolName,
      role: body.role || director.role,
      status: body.status || director.status,
      phoneNumber: body.phoneNumber || director.phoneNumber,
      address: {
        street: body.address?.street || director.address?.street,
        city: body.address?.city || director.address?.city,
        state: body.address?.state || director.address?.state,
        postalCode: body.address?.postalCode || director.address?.postalCode,
      },
      profilePicture: body.profilePicture || director.profilePicture,
      lastLogin: body.lastLogin || director.lastLogin,
      permissions: body.permissions || director.permissions,
    };

    // Update the director document
    const updatedDirector = await Directors.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    return NextResponse.json(updatedDirector, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating Director credentials" },
      { status: 500 }
    );
  }
}
