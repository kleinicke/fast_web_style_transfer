import onnx

model = onnx.load_model("public/faststyle.onnx")

for node in model.graph:
    print("jo")

for node in model.graph.input:
    print("jo")

for node in model.graph.node:
    if node.op_type == "ConstantOfShape":
        print("change ", node.name)
        if node.attribute[0].t.data_type == 7:
            node.attribute[0].t.data_type = 6
            node.attribute[0].t.raw_data = b"\000\000\000\000"
            print("done")
    if node.op_type == "Concat":
        print("hi")


onnx.save_model(model, "public/fast_opt1.onnx")
